const { conection } = require('./database/conection');
// servidor de node js
const express = require('express');
// Importando el cors
const cors = require('cors');

// Inicio de Backend
console.log('API Blog');

// Conexion a la base de datos
conection();

// Servidor de NodeJs
const app = express();
const puerto = 3001;

// Configuracion de cors
app.use(cors());

// Leer y convertir el body en un objeto js
app.use(express.json()); // Objeto js usable como objeto de js

// Rutas
app.get('/mensaje', (req, res) => {
    console.log('Se ha ejecutado el endpoint /mensaje');

    return res.status(200).json({
        mensaje: '¡Hola! Esta es una prueba de tu API.',
    });
});

// Alsar servidor y escuchar peticiones
app.listen(puerto, () => {
    console.log('SERVIDOR INICIADO EN: ' + puerto);
});
