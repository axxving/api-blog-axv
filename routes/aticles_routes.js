const express = require('express');
const router = express.Router();

// Controladores
const ArticleController = require('../controllers/articles_controller');

// Rutas de prueba
router.get('/ruta-prueba', ArticleController.prueba);

// Ruta util
router.post('/agregar', ArticleController.agregar);
// Parametros opcionales ?
router.get('/obtener-articulos', ArticleController.conseguirArticulos);

// Exportacion de la ruta
module.exports = router;
