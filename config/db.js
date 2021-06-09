const { Sequelize } = require('sequelize');
// EXTRAER VALORES DE VARIABLES .env
require('dotenv').config({ path: 'variables.env'});

// CREAMOS LA BASE DE DATOS uptasknode, EL USUARIO SERÁ root, EL PASSWORD SERÁ root
const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USUARIO, process.env.BD_PASSWORD, {
    // EL HOST ES localhost
    host: process.env.BD_HOST,
    // LA BASE DE DATOS SERÁ mysql
    dialect: 'mysql',
    // EL PUERTO SE PUEDE OMITIR SI ES AQUEL QUE VIENE POR DEFECTO
    port: process.env.BD_PORT,
    // operatorsAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = db;