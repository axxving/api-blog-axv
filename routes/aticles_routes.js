const express = require('express');
const multer = require('multer');
const router = express.Router();
const ArticleController = require('../controllers/articles_controller');

// Configuración de almacenamiento con `multer`
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './imagenes/articulos'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, 'articulo_' + Date.now() + '_' + file.originalname);
    },
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/gif',
    ];
    if (allowedExtensions.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG, GIF.'
            ),
            false
        );
    }
};

// Middleware de `multer`
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Rutas de prueba
router.get('/ruta-prueba', ArticleController.prueba);

// Rutas principales
router.post('/agregar', ArticleController.agregar);
router.get('/obtener-articulos', ArticleController.conseguirArticulos);
router.get('/search-article/:id', ArticleController.oneArticle);
router.delete('/delete/:id', ArticleController.deleteArticle);
router.put('/editar-articulo/:id', ArticleController.editArticle);
router.get('/get-image/:image?', ArticleController.getImage);
router.get('/search/:query', ArticleController.searchArticle);

// Ruta para subir imágenes
router.post(
    '/subir-imagen/:id',
    upload.single('file'),
    ArticleController.subir
);

module.exports = router;
