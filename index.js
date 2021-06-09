// ESTE SERÁ EL ARCHIVO PRINCIPAL DE CONFIGURACIÓN

// IMPORTAMOS/REQUERIMOS express
const express = require('express');
// IMPORTAMOS LAS RUTAS
const routes = require('./routes');
// AÑADIMOS LA LIBRERÍA PATH DE NODE. PATH LEE EL FILESYSTEM
const path = require('path');
// AÑADIMOS BODYPARSER
const bodyParser = require('body-parser');
// AÑADIMOS EXPRESS-VALIDATOR
const expressValidator = require('express-validator');
// AÑADIMOS LOS HELPERS
const helpers = require('./helpers');
// AÑADIMOS FLASH
const flash = require('connect-flash');
// AÑADIMOS EXPRESS-SESSION
const session = require('express-session');
// AÑADIMOS COOKIE-PARSER
const cookieParser = require('cookie-parser');
// AÑADIMOS PASSPORT
const passport = require('./config/passport.js');
// IMPORTAMOS LAS VARIABLES DE ENTORNO
require('dotenv').config({ path: 'variables.env' });

// CREAMOS LA CONEXIÓN A LA BASE DE DATOS
const db = require('./config/db.js');
// IMPORTAMOS LOS MODELOS
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

// SEQUELIZE ES UN ORM BASADO EN PROMESAS
db.sync()
    // SE ACCEDE CON .then
    .then( () => console.log('Conectado al servidor'))
    // SINO 
    .catch( error => console.log(error));

// HACEMOS UNA APP DE EXPRESS
const app = express();

// DONDE CARGAR LOS ARCHIVOS CSS
app.use(express.static('public'));

// HABILITAR PUG
// .set SE UTILIZA PARA AGREGAR UN VALOR, DECIR QUE SE VA A AGREGAR ALGO
app.set('view engine', 'pug');

// HABILITAMOS bodyParser PARA PODER LEER LOS DATOS DEL FORMULARIO
app.use(bodyParser.urlencoded({extended: true}));

// AÑADIMOS LA CARPETA DESDE LA CUAL LEERÁ LAS VISTAS. PARA ELLO IMPORTAMOS ARRIBA EL PATH
app.set('views', path.join(__dirname, './views'));

// AGREGAMOS MENSAJES FLASH
app.use(flash());

// AGREGAMOS COOKIE PARSER
app.use(cookieParser());

// AGREGAMOS LAS SESSION PARA NAVEGAR ENTRE PAGINAS SIN VOLVER A AUTENTICARNOS
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

// ARRANCAMOS UNA INSTANCIA DE PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// PASAMOS vardump A LA APLICACIÓN
app.use((req, res, next) => {
    // CON res.locals LO HACEMOS GENERAL A TODA LA APLICACIÓN
    res.locals.vardump = helpers.vardump;
    // 
    res.locals.mensajes = req.flash();
    res.locals.usuario = { ...req.user } || null;
    console.log(res.locals.usuario);
    // EL next() INDICA QUE PASE A LA SIGUIENTE FUNCIÓN
    next();
});

// LLAMAMOS A LAS RUTAS QUE VAMOS A UTILIZAR
app.use('/', routes());

// LE DECIMOS QUE PUERTO ESCUCHAR
// app.listen(3000);

// SERVIDOR Y PUERTO. HEROKU ASIGNA AUTOMATICAMENTE CUANDO NO ENCUENTRE LOS OTROS
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta en línea');
});

/*==============================================*/

// RUTA PARA HOME (MIDDLEWARE DE EXPRESS)
// app.use('/',(req, res) => {
    // .use LEE CUALQUIER MÉTODO DE HTTP, SIN TENER QUE ESPECIFICAR. SINO PUEDE USARSE .get, .post, ETC.
    // req (request) ES LA CONSULTA QUE SE HACE (AL ENVIAR UN FORMULARIO O ENTRAR EN UNA PÁGINA, ETC.) 
    // res (response) ES LO QUE DEVUELVE EL SERVIDOR
    // res.send('Hola');
    // send ES LA RESPUESTA MÁS BÁSICA. PARA MOSTRAR html PUEDE USARSE .render Y .json PARA APIS
// });