const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
// UTIL PERMITE QUE ALGO QUE SOPORTA PROMISES PERO NO ASYNC/AWAIT, LAS SOPORTE
const util = require('util');
// TRAEMOS LAS CRENDENCIALES
const emailConfig = require('../config/email');
// NODEMAILER ENVIA A TRAVÉS DE UN TRANSPORT
let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    
    auth: {
        user: emailConfig.user, 
        pass: emailConfig.pass, 
    }
});

// GENERAMOS EL HTML PARA ENVIAR EL CORREO
const generarHTML = (archivo, opciones = {} ) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    // CON juice AGREGAMOS inline LOS ESTILOS QUE DECLARAMOS EN EL CSS
    return juice(html);
}

exports.enviar = async (opciones) => {
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    let opcionesEmail = {
        from: 'Uptask <no-reply@uptask.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html 
    };
    
    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, opcionesEmail);

}