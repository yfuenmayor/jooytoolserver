const EventModels  = require('../models/Events');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');

const dateEnd = moment().format('YYYY-MM-DD');
const dateStartWeek =moment().subtract(7, 'days').format('YYYY-MM-DD');
// const tenantFalabella = {name: 'Falabella', id:'5d78fdc31ba4055ca79a8aa0'}; //QA - No es fala 
const tenantFalabella = {name: 'Falabella', id:'5d8a1a97e877ea45f52df98f'}; 
const tenantCencosud = {name: 'Cencosud', id:'5c40ca68c6e6fb3a222535aa'}; 
const tenantSura = {name: 'Directo', id:'5a04e8384f89c74080bd2d72'}; 

//Reportes de los lunes Automatizado
exports.reportsMonday = async () => {

        //Execute Function SURA:Falabella
        await eventsBattery(dateStartWeek,dateEnd,tenantFalabella)
        .then(result => console.log(`Reporte SURA:Falabella creado con Exito !`))
        .catch(e => console.log('Hubo un error report SURA:Falabella!'));

        //Execute Function SURA:Cencosud
        await eventsBattery(dateStartWeek,dateEnd,tenantCencosud)
        .then(result => console.log(`Reporte SURA:Cencosud creado con Exito !`))
        .catch(e => console.log('Hubo un error battery SURA:Cencosud!'));

        //Execute Function SURA:Directo
        await eventsBattery(dateStartWeek,dateEnd,tenantSura)
        .then(result => console.log(`Reporte SURA:Directo creado con Exito !`))
        .catch(e => console.log('Hubo un error battery SURA:Directo!'));
    
}

//Reporte de Bateria de Falabella
exports.reportBatteryFalabella = async (req,res) => {
    //Get Dates
    const { dateEnd, dateStart } = req.body;
    //Execute Function
    await eventsBattery(dateStart,dateEnd,tenantFalabella)
    .then(result => res.status(200).send(`Reporte creado con Exito !`))
    .catch(e => res.status(500).send('Hubo un error en el server'));
}

//Reporte de Bateria de Cencosud
exports.reportBatteryCencosud = async (req,res) => {
    //Get Dates
    const { dateEnd, dateStart } = req.body;
    //Execute Function
    await eventsBattery(dateStart,dateEnd,tenantCencosud)
    .then(result => res.status(200).send(`Reporte creado con Exito !`))
    .catch(e => res.status(500).send('Hubo un error en el server'));
}

//Reporte de Bateria de Cencosud
exports.reportBatterySuraDirecto = async (req,res) => {
    //Get Dates
    const { dateEnd, dateStart } = req.body;
    //Execute Function
    await eventsBattery(dateStart,dateEnd,tenantSura)
    .then(result => res.status(200).send(`Reporte creado con Exito !`))
    .catch(e => res.status(500).send('Hubo un error en el server'));
}

//Sura Reports Function
const eventsBattery = async (dateStart,dateEnd,tenants) => {
   
    const csvWriter = createCsvWriter({ 
        path: `Reports/sura/batery/${dateEnd}_Reporte Eventos ${tenants.name}.csv`,
        header: [
            {id: 'created', title: 'FECHA'},
            {id: 'subType', title: 'EVENTO'},
            {id: 'idUser', title: 'USER'},
            {id: 'userName', title: 'NOMBRE'},
            {id: 'rutUser', title: 'RUT USER'},
            {id: 'emailUser', title: 'EMAIL USER'},
            // {id: 'city', title: 'CITY'},
            // {id: 'street', title: 'STREET'},
            // {id: 'municipality', title: 'MUNICIPALITY'},
            {id: 'device', title: 'DEVICE'},
            {id: 'imeiDevice', title: 'IMEI'},
            {id: 'vehicle', title: 'VEHÍCULO'},
            {id: 'brand', title: 'MARCA'},
            {id: 'model', title: 'MODELO'},
            {id: 'patent', title: 'PATENTE'},
            {id: 'year', title: 'AÑO'},
        ]
    });

    try {
        const response = [];
        const query = {
                    //M.models.base.Types.ObjectId(tenantsFalabella)
            tenants:tenants.id,
            created: {
                $gte: new Date(dateStart),
                $lte: new Date(dateEnd)
            },
            subType: /device:battery/
        }
        
        //Consulta
        const events = await EventModels.find(query).populate('user').populate('device',['id','imei']).populate('vehicle');
        
        events.forEach(event => {
            const s = new Date(event.created);
            response.push({
                created:`${s.getDate()}/${s.getMonth()+1}/${s.getFullYear()} ${s.getHours()}:${s.getMinutes()}`,
                subType: event.subType,
                idUser: event.user.id, 
                userName: event.user.name,
                rutUser:event.user.identifiers.rutSura,
                emailUser:event.user.identifiers.emailSura,
                device: event.device.id,
                imeiDevice: event.device.imei,
                vehicle: event.vehicle.id,
                brand:event.vehicle.otherBrand,	
                model:event.vehicle.otherModel,	
                patent: event.vehicle.patent,	
                year:event.vehicle.year
            })    
        });

        //Se genera el CSV
        csvWriter.writeRecords(response)       // returns a promise
        .then(() => {
                console.log('...Done');
                return true;
        });
    } catch (e) {
        // console.log(e.message);
        throw e.message;
    }
}

