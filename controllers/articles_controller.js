const Article = require('../models/Article');

// Acción de prueba
const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: 'Soy una acción de prueba en mi controlador de artículos',
    });
};

// Acción agregar (sin validaciones)
const agregar = async (req, res) => {
    try {
        let parametros = req.body;
        console.log('Datos recibidos:', parametros);

        // Mapear `titulo` a `title` y `contenido` a `content`
        const datosArticulo = {
            title: parametros.titulo || parametros.title,
            content: parametros.contenido || parametros.content,
        };

        // Crear y guardar el artículo
        const articuloGuardado = await Article.create(datosArticulo);

        return res.status(201).json({
            status: 'success',
            articulo: articuloGuardado,
            mensaje: 'Artículo guardado correctamente',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            mensaje: 'Error al guardar el artículo',
            error: error.message,
        });
    }
};

// Obtener todos los artículos con un límite opcional
const conseguirArticulos = async (req, res) => {
    try {
        let limite = parseInt(req.query.limit) || 0;

        let articulos = await Article.find({}).sort({ date: -1 }).limit(limite);

        return res.status(200).json({
            status: 'success',
            articulos,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            mensaje: 'Error al consultar los artículos',
            error: error.message,
        });
    }
};

// Buscar un artículo por ID
const oneArticle = async (req, res) => {
    try {
        let id = req.params.id;
        let articulo = await Article.findById(id);

        if (!articulo) {
            return res.status(404).json({
                status: 'error',
                mensaje: 'No se ha encontrado el artículo',
            });
        }

        return res.status(200).json({
            status: 'success',
            articulo,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            mensaje: 'Error al buscar el artículo',
            error: error.message,
        });
    }
};

// Eliminar un artículo por ID
const deleteArticle = async (req, res) => {
    try {
        let id = req.params.id;
        let articuloBorrado = await Article.findByIdAndDelete(id);

        if (!articuloBorrado) {
            return res.status(404).json({
                status: 'error',
                mensaje: 'No se encontró el artículo para eliminar',
            });
        }

        return res.status(200).json({
            status: 'success',
            articulo: articuloBorrado,
            mensaje: 'Se ha eliminado el artículo correctamente',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            mensaje: 'Error al eliminar el artículo',
            error: error.message,
        });
    }
};

// Editar un artículo por ID (sin validaciones)
const editArticle = async (req, res) => {
    try {
        let articleId = req.params.id;
        let parametros = req.body;

        // Mapear `titulo` a `title` y `contenido` a `content`
        const datosActualizados = {
            title: parametros.titulo || parametros.title,
            content: parametros.contenido || parametros.content,
        };

        let articuloActualizado = await Article.findByIdAndUpdate(
            articleId,
            datosActualizados,
            { new: true } // Devuelve el documento actualizado sin validaciones
        );

        if (!articuloActualizado) {
            return res.status(404).json({
                status: 'error',
                mensaje: 'No se encontró el artículo para actualizar',
            });
        }

        return res.status(200).json({
            status: 'success',
            articulo: articuloActualizado,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            mensaje: 'Error al actualizar el artículo',
            error: error.message,
        });
    }
};

module.exports = {
    prueba,
    agregar,
    conseguirArticulos,
    oneArticle,
    deleteArticle,
    editArticle,
};
