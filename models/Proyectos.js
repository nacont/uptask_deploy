// IMPORTAMOS SEQUELIZE
const Sequelize = require('sequelize');
// IMPORTAMOS LA CONEXIÓN Y CONFIGURACIÓN DE LA BASE DE DATOS
const db = require('../config/db');
// IMPORTAMOS SLUG
const slug = require('slug');
// IMPORTAMOS SHORTID
const shortId = require('shortId');
// DEFINIMOS EL MODELO. LE DAMOS EL MODELO
const Proyectos = db.define('proyectos',{
    // DEFINIMOS LA ESTRUCTURA DE LA BASE DE DATOS
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    // SI SE PASA UN SOLO VALOR SE PUEDEN OMITIR LAS LLAVES
    nombre: Sequelize.STRING(100),
    url: Sequelize.STRING(100)
}, {
    // LOS hooks CORREN UNA FUNCIÓN EN DETERMINADO TIEMPO
    hooks: {
        // SE EJECUTA ANTES QUE SEA INSERTADO EN LA BASE DE DATOS
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();
            proyecto.url = `${url}-${shortId.generate()}`;
        }
    }
});

module.exports = Proyectos;