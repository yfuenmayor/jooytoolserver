const TripsModel = require('../models/Trips');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


exports.tripsMonth = async (req, res) => {

    const { vehicle, dateStart, dateEnd } = req.body;
    const response = [];
    var totalKm = 0;

    const csvWriter = createCsvWriter({
        path: `reports/trips/Reporte_viajes_${dateStart}_${dateEnd}.csv`,
        
        header: [
            {id: 'inicio', title: 'INICIO'},
            {id: 'fin', title: 'FIN'},
            {id: 'velMax', title: 'VEL. MAX KM'},
            {id: 'velProm', title: 'VEL. PROM. KM'},
            {id: 'distancia', title: 'DISTANCIA KM'}
        ]
    });

    try {
        //Query
        const query = {vehicle, created: { $gte: new Date(dateStart), $lte: new Date(dateEnd) }, anomaly:{$exists:false}}
        //Project
        const select = {"start.time":1, "end.time":1, "dist":1, "metrics.speedMax":1, "metrics.speedAvg":1, "_id":0}
        //Consulta
        const trips = await TripsModel.find(query, select).sort({_id: 1});

        //Creamos el array con los datos del CSV
         trips.forEach( trip => {
             const s = new Date(trip.start.time);
             const f = new Date(trip.end.time);
             totalKm = totalKm + trip.dist;
             response.push({
                 inicio:  `${s.getDate()}/${s.getMonth()+1}/${s.getFullYear()} ${s.getHours()}:${s.getMinutes()}`,
                 fin:  `${f.getDate()}/${f.getMonth()+1}/${f.getFullYear()} ${f.getHours()}:${f.getMinutes()}`,
                 velMax:  (trip.metrics.speedMax) ? trip.metrics.speedMax.toFixed(2).replace(/\./g, ',') : "0",
                 velProm:  (trip.metrics.speedAvg) ? trip.metrics.speedAvg.toFixed(2).replace(/\./g, ',') : "0",
                 distancia: trip.dist.toFixed(2).replace(/\./g, ',')
             })
        });

        const TotalKm = totalKm.toFixed(2).replace(/\./g, ',');

        //Agregamos al final el total de kms
        response.push({ velProm:  `Total Km: `, distancia:  `${TotalKm}`,})

        // Generated file .csv
        csvWriter.writeRecords(response)       // returns a promise
        .then(() => {
                console.log('...Done');
                res.status(200).send(`Done....Total ${TotalKm} km`);
        });

    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error en el server');
    }
}   




