const validator = require('validator');
const Articulo = require('../models/Article');

// Accion
const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: 'Soy una accion de prueba en mi controlador de articulos',
    });
};

// Accion agregar
const agregar = (req, res) => {
    // Recoger parámetros por POST
    let parametros = req.body;

    // Verificar que parametros no sea undefined o nulo
    if (!parametros || !parametros.titulo || !parametros.contenido) {
        return res.status(400).json({
            status: 'error',
            mensaje: 'Faltan datos por enviar',
        });
    }

    // Validar datos
    try {
        let validar_titulo =
            !validator.isEmpty(parametros.titulo) &&
            validator.isLength(parametros.titulo, { min: 5, max: 15 });
        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if (!validar_titulo || !validar_contenido) {
            throw new Error('No se ha validado la información!!');
        }
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            mensaje: 'Faltan datos por enviar',
        });
    }

    // Crear el objeto basado en el modelo
    const articulo = new Articulo({
        titulo: parametros.titulo,
        contenido: parametros.contenido,
    });

    // Guardar el artículo en la base de datos
    articulo
        .save()
        .then(articuloGuardado => {
            return res.status(200).json({
                status: 'success',
                articulo: articuloGuardado,
                mensaje: 'Artículo guardado correctamente',
            });
        })
        .catch(error => {
            return res.status(400).json({
                status: 'error',
                mensaje: 'No se ha guardado el artículo',
            });
        });
};

// Accion obtener
const conseguirArticulos = async (req, res) => {
    try {
        // Obtener el parámetro opcional 'limit' desde la query, con valor predeterminado de 0 (sin límite)
        let limite = parseInt(req.query.limit) || 0;

        // Consultar artículos ordenados por fecha de creación descendente y aplicar el límite
        let articulos = await Articulo.find({})
            .sort({ fecha: -1 }) // Ordenar por fecha descendente (el más reciente primero)
            .limit(limite); // Aplicar límite si se proporciona

        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: 'error',
                mensaje: 'No se han encontrado artículos',
            });
        }

        return res.status(200).json({
            status: 'success',
            articulos,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            mensaje: 'Error al consultar los artículos',
        });
    }
};

// Buscar un articulo por su id
const oneArticle = async (req, res) => {
    try {
        // Recoger el id de la URL
        let id = req.params.id;

        // Buscar el artículo en la base de datos
        let articulo = await Articulo.findById(id);

        // Si no existe, devolver un error
        if (!articulo) {
            return res.status(404).json({
                status: 'error',
                mensaje: 'No se ha encontrado el artículo',
            });
        }

        // Devolver resultado
        return res.status(200).json({
            status: 'success',
            articulo,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            mensaje: 'Error al buscar el artículo',
        });
    }
};

module.exports = {
    prueba,
    agregar,
    conseguirArticulos,
    oneArticle,
};
