//Ruta para los reportes
const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports');

//Reportes Generales
// SURA:Falabella Battery -- api/reports/falabella/battery
router.post('/falabella/battery', 
    reportsController.reportBatteryFalabella
)
// SURA:Cencosud Battery -- api/reports/cencosud/battery
router.post('/cencosud/battery', 
    reportsController.reportBatteryCencosud
)
// SURA:Directo Battery -- api/reports/suradirecto/battery
router.post('/suradirecto/battery', 
    reportsController.reportBatterySuraDirecto
)

module.exports = router;