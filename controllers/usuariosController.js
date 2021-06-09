const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en UpTask'
    });
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar sesión en UpTask',
        error
    });
}

exports.crearCuenta = async (req, res) => {
    // LEEMOS LOS DATOS
    const { email, password } = req.body;

    try {
        // CREAMOS LOS USUARIOS
        await Usuarios.create({
            email,
            password
        });

        // CREAMOS UNA URL DE CONFIRMAR
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        
        // CREAMOS EL OBJETO DE USUARIO CON LA PROPIEDAD EMAIL
        const usuario = {
            email
        }

        // ENVIAMOS EL EMAIL
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta en UpTasl',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        req.flash('correcto', 'Te envíamos un correo, confirma tu cuenta');
        // REDIRIGIMOS AL USUARIO
        res.redirect('/iniciar-sesion');
    } catch (error) {
        // UTILIZANDO connect-flash. GENERO EL OBJETO DE ERRORES, CON TODOS LOS QUE TENGO
        req.flash('error', error.errors.map( error => error.message ));
        res.render('crearCuenta', {
            // errores ES COMO LO ENVIAREMOS NOSOTROS. errors ES COMO LO DEVUELVE SEQUELIZE
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en UpTask',
            email,
            password           
        })   
    }    
}

exports.formReestablecerPassword = async (req, res, netx) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    })
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });
    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}