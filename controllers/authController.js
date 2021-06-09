const passport = require('passport');
const Usuarios = require('../models/Usuarios');
// UTILIDAD DE NODE QUE USAREMOS PARA GENERAR UN TOKEN
const crypto = require('crypto');
// IMPORTAMOS OPERADORES DE SEQUELIZE
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

// LA ESTRATEGIA EN ESTE CASO ES LOCAL, PERO PODRÍA SER TAMBIEN FACEBOOK, ETC.
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    // ESTA INTEGRADO CON connect-flash
    failureFlash: true,
    // REESCRIBIMOS EL MENSAJE POR DEFECTO
    badRequestMessage: 'Ambos campos son obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {

    if(req.isAuthenticated()) 
        return next();
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res, next) => {
    req.session.destroy( () => {
        res.redirect('/iniciar-sesion');
    });
}

// ENVIAMOS TOKEN SI EL USUARIO ES VÁLIDO
exports.enviarToken = async (req, res) => {
    // VERIFICAMOS QUE EL USUARIO EXISTA
    const { email } = req.body;
    const usuario = await Usuarios.findOne({
        where: {
            email: email
        }
    });
    
    // SI NO EXISTE EL USUARIO
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }
    
    // SI EXISTE
    // GENERAMOS TOKEN
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    // GUARDAMOS EN LA BD
    await usuario.save();
    // URL DE RESET
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    // ENVIAMOS EL CORREO CON EL TOKEN
    await enviarEmail.enviar({
        usuario,
        subject: 'Reseteo de contraseña',
        resetUrl,
        archivo: 'reestablecer-password'
    });
    req.flash('correcto', 'Se envío un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
    
}

exports.validarToken = async (req, res) => {
    const usuario = Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });   
    // SI NO ENCUENTRA EL USUARIO
    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }
    // FORMULARIO PARA GENERAR EL PASSWORD
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer contraseña'
    });
}

// CAMBIAR EL PASSWORD
exports.actualizarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });
    
    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    // HASHEAMOS EL NUEVO PASSWORD
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    await usuario.save();

    req.flash('correcto', 'Tu contraseña fue modificada correctamente');
    res.redirect('/iniciar-sesion');
}