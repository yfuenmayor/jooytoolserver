const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/shippingorders');

//Ruta para obtener los utlimos shippinorders de usuarios seleccionados
router.post('/status', 
    tripsController.statusDevices
)

module.exports = router;
