//Ruta para los usuarios
const express = require('express');
const router = express.Router();

//crea un usuario
// api/users
router.post('/', () => {
   console.log('Prueda desde postman /users'); 
})

module.exports = router;

