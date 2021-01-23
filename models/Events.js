const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({ 
    tenants:[mongoose.ObjectId],
    created: Date,
    subType:String,
    user: { type: mongoose.ObjectId, ref: 'User' },
    device: { type: mongoose.ObjectId, ref: 'Device' },
    vehicle: { type: mongoose.ObjectId, ref: 'Vehicle' }
});

const User = mongoose.model('User',mongoose.Schema({
    _id: mongoose.ObjectId, name:String, 'identifiers.rutSura': String, 'identifiers.emailSura': String
}));

const Device = mongoose.model('Device',mongoose.Schema({ _id: mongoose.ObjectId, imei:String }));

const Vehicle = mongoose.model('Vehicle',mongoose.Schema({
    _id: mongoose.ObjectId, otherBrand:String, otherModel: String, patent: String, year:Number
}));


module.exports = mongoose.model('Event', EventSchema,'events');