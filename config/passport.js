const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// REFERENCIAMOS EL MODELO DONDE VAMOS A AUTENTICAR
const Usuarios = require('../models/Usuarios');

// LOCAL STRATEGY. LOGIN CON CREDENCIALES PROPIAS: USUARIO Y PASSWORD
passport.use(
    new LocalStrategy(
        {
            // POR DEFECTO ESPERA EL CAMPO username, POR ESO LO REDEFINIMOS
            usernameField: 'email',
            passwordField: 'password'
        },
        // HACEMOS LA CONSULTA A LA BASE DE DATOS
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email: email,
                        activo: 1
                    }
                });
                // EL USUARIO EXISTE, PERO EL PASSWORD ESTÁ MAL
                if(!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Contraseña errónea'
                    });
                }
                // SI ESTÁ TODO BIEN, RETORNAMOS EL USUARIO
                return done(null, usuario);
            } catch (error) {
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                });
            }
        }
    )
);

// HAY QUE SERIALIZAR 
passport.serializeUser( (usuario, callback) => {
    callback(null, usuario);
}); 
// Y DESSERIALIZAR EL USUARIO
passport.deserializeUser( (usuario, callback) => {
    callback(null, usuario);
}); 

module.exports = passport;