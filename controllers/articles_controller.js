const Article = require('../models/Article');
const fs = require('fs');
const path = require('path');

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

// Subir un fichero a mongo
const subir = async (req, res) => {
    try {
        // Verificar si hay un archivo subido
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                mensaje: 'No se ha subido ninguna imagen.',
            });
        }

        // Nombre del archivo subido
        let filePath = req.file.path;
        let fileName = req.file.filename;
        let fileExtension = path.extname(fileName).toLowerCase();

        // Validar la extensión del archivo
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        if (!allowedExtensions.includes(fileExtension)) {
            fs.unlinkSync(filePath); // Eliminar el archivo no válido
            return res.status(400).json({
                status: 'error',
                mensaje:
                    'Extensión no válida. Solo se permiten imágenes JPG, PNG, GIF.',
            });
        }

        // Obtener el ID del artículo
        let articleId = req.params.id;

        // Actualizar el artículo con la imagen
        let articuloActualizado = await Article.findByIdAndUpdate(
            articleId,
            { image: fileName },
            { new: true }
        );

        if (!articuloActualizado) {
            return res.status(404).json({
                status: 'error',
                mensaje:
                    'No se encontró el artículo para actualizar con la imagen.',
            });
        }

        return res.status(200).json({
            status: 'success',
            articulo: articuloActualizado,
            file: fileName,
            mensaje: 'Imagen subida correctamente.',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            mensaje: 'Error al subir la imagen.',
            error: error.message,
        });
    }
};

// Obtener imagen específica o listar todas las imágenes disponibles
const getImage = async (req, res) => {
    try {
        // Obtener el nombre de la imagen desde los parámetros de la URL
        const imageName = req.params.image;

        // Ruta donde están almacenadas las imágenes
        const directoryPath = path.join(__dirname, '../imagenes/articulos');

        // Si no se proporciona un nombre de imagen, devolver la lista de imágenes
        if (!imageName) {
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    return res.status(500).json({
                        status: 'error',
                        mensaje: 'Error al obtener la lista de imágenes.',
                    });
                }

                return res.status(200).json({
                    status: 'success',
                    imagenes: files,
                });
            });
            return;
        }

        // Si se proporciona un nombre de imagen, devolver el archivo
        const imagePath = path.join(directoryPath, imageName);

        if (fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        } else {
            return res.status(404).json({
                status: 'error',
                mensaje: 'La imagen no existe en el servidor.',
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            mensaje: 'Error al procesar la solicitud.',
            error: error.message,
        });
    }
};

// Acción para buscar artículos por título o contenido
const searchArticle = async (req, res) => {
    try {
        // Obtener el término de búsqueda desde los parámetros de la URL
        let searchQuery = req.params.query;

        // Buscar artículos que contengan el término en el título o contenido (insensible a mayúsculas)
        let articles = await Article.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { content: { $regex: searchQuery, $options: 'i' } },
            ],
        }).sort({ date: -1 });

        // Si no se encuentran artículos, devolver un mensaje adecuado
        if (!articles.length) {
            return res.status(404).json({
                status: 'error',
                mensaje:
                    'No se encontraron artículos con ese término de búsqueda.',
            });
        }

        return res.status(200).json({
            status: 'success',
            articulos: articles,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            mensaje: 'Error al realizar la búsqueda de artículos.',
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
    subir,
    getImage,
    searchArticle,
};
