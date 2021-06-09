const express = require('express');
const router = express.Router();

// IMPORTAMOS EL VALIDADOR, express validator. ES AQUÍ DONDE SE VALIDA
// SE PUEDE SELECCIONAR IMPORTAR SEGÚN QUE SEA LO QUE QUEREMOS VALIDAR (body, headers, etc...)
const { body } = require('express-validator');

// IMPORTAMOS EL CONTROLADOR
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {
    
    router.get('/', 
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );    
    
    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );    
    
    router.post('/nuevo-proyecto', 
        // COLOCAMOS LA VALIDACIÓN ANTES DEL CONTROLADOR. 
        // body PORQUE ES LO QUE IMPORTAMOS EN LA LÍNEA 6. 
        // nombre PORQUE ES EL CAMPO QUE QUEREMOS VALIDAR
        // isEmpty() DEVUELVE TRUE/FALSE
        // .not() PORQUE QUEREMOS VERIFICAR QUE NO ESTE VACÍO
        // .trim() PARA QUE ELIMINE LOS ESPACIO DE COMIENZO Y FIN EN BLANCO
        // .escape() PARA EVITAR LA INYECCIÓN SQL
        authController.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );    
    
    // LISTAR PROYECTO
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );

    // ACTUALIZAR PROYECTO
    router.get('/proyecto/editar/:id', 
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );

    router.post('/nuevo-proyecto/:id', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );  

    // ELIMINAR PROYECTO
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    // RUTA DE TAREAS
        // CREAR TAREA
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );
        // ACTUALIZAR TAREA. .patch ES SIMILAR A .put SOLO QUE .put REESCRIBE TODO EL OBJETO Y .patch SOLO UNA PARTE
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea);
        // ELIMINAR TAREA
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    // CREAR NUEVA CUENTA
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);
    // INICIAR SESIÓN
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);
    // CERRAR SESIÓN
    router.get('/cerrar-sesion', authController.cerrarSesion);
    // RESTABLECER CONTRASEÑA
    router.get('/reestablecer', usuariosController.formReestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);
    return router;
}
