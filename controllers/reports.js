const EventModels  = require('../models/Events');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');

const dateEnd = moment().format('YYYY-MM-DD');
const dateStartWeek = moment().subtract(7, 'days').format('YYYY-MM-DD');
const dateStartMonth = moment().subtract(30, 'days').format('YYYY-MM-DD');

// const tenantFalabella = {name: 'Falabella', id:'5d78fdc31ba4055ca79a8aa0'}; //QA - No es fala 
const tenantFalabella = {name: 'Falabella', id:'5d8a1a97e877ea45f52df98f'}; 
const tenantCencosud = {name: 'Cencosud', id:'5c40ca68c6e6fb3a222535aa'}; 
const tenantSura = {name: 'Directo', id:'5a04e8384f89c74080bd2d72'}; 

//Reportes de los lunes Automatizado
exports.reportsMonday = async () => {
        
        //Execute Function SURA:Falabella
        await eventsBatterySura(dateStartMonth,dateEnd,tenantFalabella)
        .then(result => console.log(`Reporte SURA:Falabella creado con Exito !`))
        .catch(e => console.log('Hubo un error report SURA:Falabella!'));

        // Execute Function SURA:Cencosud
        await eventsBatterySura(dateStartMonth,dateEnd,tenantCencosud)
        .then(result => console.log(`Reporte SURA:Cencosud creado con Exito !`))
        .catch(e => console.log('Hubo un error battery SURA:Cencosud!'));

        //Execute Function SURA:Directo
        await eventsBatterySura(dateStartMonth,dateEnd,tenantSura)
        .then(result => console.log(`Reporte SURA:Directo creado con Exito !`))
        .catch(e => console.log('Hubo un error battery SURA:Directo!'));

        //Execute Function SURA
        await eventsDtcsSura()
        .then(result => console.log(`Reporte SURA:Directo creado con Exito !`))
        .catch(e => console.log('Hubo un error battery SURA:Directo!'));
    
}

//Reporte de Bateria de Falabella
exports.reportBatteryFalabella = async (req,res) => {
    //Get Dates
    const { dateEnd, dateStart } = req.body;
    //Execute Function
    await eventsBatterySura(dateStart,dateEnd,tenantFalabella)
    .then(result => res.status(200).send(`Reporte creado con Exito !`))
    .catch(e => res.status(500).send('Hubo un error en el server'));
}

//Reporte de Bateria de Cencosud
exports.reportBatteryCencosud = async (req,res) => {
    //Get Dates
    const { dateEnd, dateStart } = req.body;
    //Execute Function
    await eventsBatterySura(dateStart,dateEnd,tenantCencosud)
    .then(result => res.status(200).send(`Reporte creado con Exito !`))
    .catch(e => res.status(500).send('Hubo un error en el server'));
}

//Reporte de Bateria de Directo
exports.reportBatterySuraDirecto = async (req,res) => {
    //Get Dates
    const { dateEnd, dateStart } = req.body;
    //Execute Function
    await eventsBatterySura(dateStart,dateEnd,tenantSura)
    .then(result => res.status(200).send(`Reporte creado con Exito !`))
    .catch(e => res.status(500).send('Hubo un error en el server'));
}

exports.getReport = async (req,res) => {
     // var filePath = "reports/sura/batery/"; // Or format the path using the `id` rest param
    // var fileName = "2021-01-16_to_2021-01-23_Reporte Eventos Sura.csv"; // The default name the browser will use
    // res.download(`${filePath}${fileName}`);   
    
    console.log('date');
}

exports.getSuraBateryReports = async (req,res) => {
    const files = fs.readdirSync('reports/sura/batery');
    res.json({ files })  
}

//Sura Reports Function
const eventsBatterySura = async (dateStart,dateEnd,tenants) => {
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
        
        console.log(`Consultando datos para reporte de ${tenants.name}...`);
        //Consulta
        const events = await EventModels.find(query).populate('user').populate('device',['id','imei']).populate('vehicle');
        
        console.log('preparando datos...');
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
        console.log('creando csv...');
        await csvWriter.writeRecords(response)
        console.log('...Done');
    } catch (e) {
        // console.log(e.message);
        throw e.message;
    }
}
//Sura Reports Function
exports.eventsDtcsSura = async () => {
    
    const csvWriter = createCsvWriter({
        path: `reports/sura/dtcs/${dateEnd}_Reporte DTCs Sura.csv`,
        
        header: [
            {id: 'created', title: 'FECHA'},
            {id: 'tenant', title: 'CANAL'},
            {id: 'subType', title: 'EVENTO'},
            //{id: 'code', title: 'CODIGO'},
            {id: 'severity', title: 'SEVERIDAD'},
            {id: 'typeDtc', title: 'TIPO DTC'},
            {id: 'lang', title: 'IDIOMA'},
            {id: 'title', title: 'DTC'},
            {id: 'description', title: 'DESCRIPCIÓN DTC'},
            {id: 'symptom', title: 'Sintoma'},
            {id: 'cause', title: 'Causa'},
            {id: 'suggestion', title: 'SUGERENCIA'},		
            // User
            {id: 'idUser', title: 'USER'},
            {id: 'userName', title: 'NOMBRE'},
            {id: 'rutUser', title: 'RUT USER'},
            {id: 'emailUser', title: 'EMAIL USER'},
            // Device
            {id: 'device', title: 'DEVICE'},
            {id: 'imeiDevice', title: 'IMEI'},
            // Vehicle
            {id: 'vehicle', title: 'VEHÍCULO'},
            {id: 'brand', title: 'MARCA'},
            {id: 'model', title: 'MODELO'},
            {id: 'patent', title: 'PATENTE'},
            {id: 'year', title: 'AÑO'},
        ]
    });

    try {
        setup(true).then(
            async M => {
                const response = [];
                const query = {
                    tenants: {$in:[
                        tenantFalabella.id,
                        tenantCencosud.id,
                        tenantSura.id
                ]},
                    created: {
                        $gte: new Date(dateStartWeek),
                        $lte: new Date(dateEnd)
                    },
                    //type:"vehicle",
                subType:/vehicle:dtc/
                }
    
                const Events = M.models.model('Event')
                const events = await Events.find(query).populate('user').populate('device').populate('vehicle')
                
                    await events.map(async event => {
    
                        if (event.subType != "vehicle:dtc:pending"){
    
                            if (event.tenants == "5d8a1a97e877ea45f52df98f"){
                                tenant = "Falabella"
                            }else {
                                if(event.tenants == "5c40ca68c6e6fb3a222535aa"){
                                    tenant = "Cencosud"
                                }else {
                                    if(event.tenants == "5a04e8384f89c74080bd2d72"){
                                        tenant = "Directo"
                                }
                            }
                        }
    
                            //DTC
                            event.info.data.DTCs.map(codeDtc => {
                                console.log('codeDtc', codeDtc)
                                response.push({
                                    created:  new Date(event.created),
                                    tenant:tenant,
                                    subType: event.subType,
                                    //User
                                    idUser: event.user.id, 
                                    userName: event.user.name,
                                    rutUser:event.user.identifiers.rutSura,
                                    emailUser:event.user.identifiers.emailSura,
                                    // Device
                                    device: event.device.id,
                                    imeiDevice: event.device.imei,
                                    // Vehicle
                                    vehicle: event.vehicle.id,
                                    brand:event.vehicle.otherBrand,	
                                    model:event.vehicle.otherModel,	
                                    patent: event.vehicle.patent,	
                                    year:event.vehicle.year,
                                    code:codeDtc,
                                    // Dtc
                                    title:"",
                                    description:"",
                                    symptom:"",
                                    cause: "",
                                    suggestion:"",
                                    severity:"",
                                    typeDtc:"",
                                    lang:"",
                                })
                            });
                            //console.log("response", response)
                        }
                    })
    
                    for(let resp of response) {
                        const dtcs = await M.models.model('DTC').find({code:resp.code})
                        if (dtcs.length>0){
                            resp.title = dtcs[0].title
                            console.log(resp.title)
                            resp.description = dtcs[0].description
                            resp.description = (resp.description)?resp.description.replace(/(<([^>]+)>)/gi, ""):""
                            // resp.description = resp.description.replace(/(<([^>]+)>)/gi, "")
                            resp.symptom = dtcs[0].symptom
                            resp.symptom = (resp.symptom)?resp.symptom.replace(/(<([^>]+)>)/gi, ""):""
                            // resp.symptom = resp.symptom.replace(/(<([^>]+)>)/gi, "")
                            resp.cause = dtcs[0].cause
                            resp.cause = (resp.cause)?resp.cause.replace(/(<([^>]+)>)/gi, ""):""
                            // resp.cause = resp.cause.replace(/(<([^>]+)>)/gi, "")
                            resp.suggestion = dtcs[0].suggestion
                            resp.suggestion = (resp.suggestion)?resp.suggestion.replace(/(<([^>]+)>)/gi, ""):""
                            // resp.suggestion = resp.suggestion.replace(/(<([^>]+)>)/gi, "")
                            
                            if (dtcs[0].severity == 0){
                                resp.severity = "Bajo"
                            }else{
                                if (dtcs[0].severity == 1){
                                    resp.severity = "Media"
                                }else{
                                    if (dtcs[0].severity == 2){
                                        resp.severity = "Grave"
                                    }else{
                                        if (dtcs[0].severity == 3){
                                            resp.severity = "Critica"
                                        }
                                    }
                                }
                            }						
                            resp.typeDtc = dtcs[0].type
                            resp.lang = dtcs[0].lang
                            console.log("RESPONSE",response)
                        }else{
                            console.log("Este code no tiene info", resp.code)
                        }
                    }
                    
                console.log("response",response)
    
                //Se genera el CSV
                console.log('creando csv...');
                await csvWriter.writeRecords(response)
                console.log('...Done');
        })
    } catch ( e ) {
             console.log( 'EXT ERRROR', e.message);
            //  throw e.message;
    }

}

