// EL MODELO TIENE LA CONEXIÓN A LA BASE DE DATOS Y TRAE POR ESO SUS MÉTODOS.
const Proyectos = require('../models/Proyectos.js');
const Tareas = require('../models/Tareas.js');
// IMPORTAMOS SLUG

exports.proyectosHome = async (req, res) => {
    // CONSULTAMOS A LA BD TODOS LOS PROYECTOS

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
    res.render('index', {
        nombrePagina: 'Proyectos',
        // PASAMOS EL RESULTADO A LA VISTA
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
    // NECESITAMOS LA LIBRERÍA bodyParser PARA ACCEDER A LOS VALORES, LOS CUALES SE VERAN EN LA CONSOLA, PERO NO LA DEL NAVEGADOR
    // console.log(req.body);
    const { nombre } = req.body;

    let errores = [];

    if(!nombre)
        errores.push({ 'texto': 'Agrega un nombre al proyecto'});

    if(errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo proyecto',
            errores,
            proyectos
        });
    } else {
        // EL MÉTODO create TOMA POR PARÁMETRO LO QUE SE VA A INSERTAR EN LA BASE DE DATOS
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });            
        res.redirect('/');
    }

}

exports.proyectoPorUrl = async (req, res, next) => {
    const proyectosPromise = Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
    // const proyectosPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId: usuarioId
        }
    });

    const [ proyectos, proyecto ] = await Promise.all([ proyectosPromise, proyectoPromise ]);
    
    // SI NO HAY RESULTADO, SE SALTEA LO QUE SIGUE Y SIGUE EJECUTANTO EL RESTO DEL CÓDIGO
    if(!proyecto)
        return next();

    // CONSULTAR TAREAS DEL PROYECTO ACTUAL
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        // INCLUIMOS EL MODELO COMPLETO. ASI PODRÍAMOS TRAERLO COMO CON UN with
        // include: [
        //     {
        //         model: Proyectos
        //     }
        // ]
    });

    // PASAMOS A LA VISTA
    res.render('tareas', {
        nombrePagina: 'Tareas del proyecto',
        proyectos,
        proyecto,
        tareas
    })
}

exports.formularioEditar = async (req, res) => {

    const proyectosPromise = Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId: usuarioId
        }
    });
    // COMO SON MÚLTIPLES CONSULTAS, INDEPENDIENTES ENTRE SI, CONVIENE COLOCARLAS DENTRO DE UN PROMISE PARA QUE NO SE BLOQUEEN ENTRE SI
    const [ proyectos, proyecto ] = await Promise.all([ proyectosPromise, proyectoPromise ]);
    
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto', 
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
    
    const { nombre } = req.body;

    let errores = [];

    if(!nombre)
        errores.push({ 'texto': 'Agrega un nombre al proyecto'});

    if(errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo proyecto',
            errores,
            proyectos
        });
    } else { 
        
        await Proyectos.update({ 
            nombre: nombre 
        },{
            where: { 
                id: req.params.id 
            }
        });            
        res.redirect('/');
    }

}

exports.eliminarProyecto = async (req, res, next) => {
    // req CONTIENE LA INFORMACIÓN. SE PUEDEN LEER LOS DATOS EN params O query
    const { urlProyecto } = req.query;

    const resultado = await Proyectos.destroy({
        where: {
            url: urlProyecto
        }
    });
    
    if(!resultado) {
        next();
    }
    // ENVIAMOS LA RESPUESTA AL AXIOS DE ELIMINAR
    res.status(200).send('Proyecto eliminado correctamente');

}