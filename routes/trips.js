//Ruta para los Trips
const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips')

//crea un usuario
// api/trips/month
router.post('/month', 
    tripsController.tripsMonth
)

module.exports = router;