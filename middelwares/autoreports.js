const cron = require('node-cron');
const reportsController = require('../controllers/reports');

const autoReports = ( ) => {
    //Reporte de todos los lunes a las 6am
    cron.schedule('00 6 * * */1', 
        reportsController.reportsMonday 
    )
}

module.exports =  autoReports;