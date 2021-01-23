const express = require('express');
const conexionDB = require('./config/db')
const autoReports  = require('./middelwares/autoreports');

//Crear el servidor
const server = express();

//Conectar con la base de datos 
conexionDB();

//Habilitar express.json
server.use(express.json({ extended: true }));

//Puerto del server
const PORT = process.env.PORT || 4140;

//Definimos las rutas de la API
server.use('/api/users', require('./routes/users'))
server.use('/api/trips', require('./routes/trips'))
server.use('/api/shipping', require('./routes/shipping'))
server.use('/api/reports', require('./routes/reports'))

//Iniciamos el servidor 
server.listen(PORT, () => {
 console.log(`El servidor se esta ejecutando en el puerto ${PORT}`);   
})

//Ejecutando los reportes automaticos
autoReports()