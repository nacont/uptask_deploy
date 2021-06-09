// EL MODELO TIENE LA CONEXIÓN A LA BASE DE DATOS Y TRAE POR ESO SUS MÉTODOS.
const Proyectos = require('../models/Proyectos.js');
const Tareas = require('../models/Tareas.js');

exports.agregarTarea = async (req, res, next) => {
    
    // OBTENEMOS EL PROYECTO ACTUAL
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    // LEEMOS EL VALOR DEL INPUT
    const { tarea } = req.body;
    // POR DEFAULT LA ACCIÓN NO ESTÁ COMPLETA
    const estado = 0;
    // EN LA TABLA VINCULAMOS EN EL CAMPO proyectoId. MANTENEMOS LA INTEGRIDAD ESTRUCTURAL 
    const proyectoId = proyecto.id;

    // INSERTAMOS EN LA BASE DE DATOS
    const resultado = await Tareas.create({ tarea, estado, proyectoId });
    
    if(!resultado) {
        return next();
    }
    
    // REDIRECCIONAMOS A LA MISMA PÁGINA PARA QUE RECARGUE
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req, res, next) => {
    // CACHEO EN EL BACKEND EL ID DE LA TAREA PARA SABER CUAL MODIFICAR
    const { id } = req.params;
    const tarea = await Tareas.findOne({ 
        where: {
            id: id
        }
    });
    
    // CAMBIAR EL ESTADO
    let estado = 0;
    if(tarea && tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;
    // .save ES UN MÉTODO DE SEQUELIZE PARA ALMACENAR EN LA BD
    const resultado = await tarea.save(); 

    if(!resultado)
        return next();

    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req, res, next) => {
    // COMO ESTAMOS ENVIANDO LOS params, PODEMOS ACCEDER POR .query
    const { id } = req.params;
    const resultado = await Tareas.destroy({
        where: {
            id: id
        }
    });
    if(!resultado)
        return next();
    res.status(200).send('Tarea eliminada correctamente');
}