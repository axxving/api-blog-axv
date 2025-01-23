const { default: mongoose } = require('mongoose');
const mongosoe = require('mongoose');

// Conexion a la base de datos
const conection = async () => {
    try {
        // Uso de mongoose
        await mongoose.connect('mongodb://localhost:27017/mi_blog');
        // Conexion exitosa
        console.log('MONGO CONECTADO');
    } catch (error) {
        // Mostrando el error
        console.log(error);
        // Error
        throw new error('No se pudo conectar a la base de datos');
    }
};

module.exports = {
    conection,
};
