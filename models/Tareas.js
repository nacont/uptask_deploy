// IMPORTAMOS SEQUELIZE
const Sequelize = require('sequelize');
// IMPORTAMOS LA CONEXIÓN Y CONFIGURACIÓN DE LA BASE DE DATOS
const db = require('../config/db');
// IMPORTAMOS EL MODELO DE PROYECTOS PARA CONECTARLO
const Proyectos = require('./Proyectos');
// DEFINIMOS EL MODELO
const Tareas = db.define('tareas',{
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1),
});

// CADA VEZ QUE CREE UNA TAREA, LA TAREA PERTENECERÁ AL PROYECTO. CREAMOS LA CLAVE FORANEA
Tareas.belongsTo(Proyectos);

module.exports = Tareas;
