const mongoose = require('mongoose');

const TripsSchema = mongoose.Schema({
    vehicle: mongoose.ObjectId,
    created: Date,
    "start.time": Date,
    "end.time": Date,
    "metrics.speedMax": Number,
    "metrics.speedAvg": Number,
    dist: Number
});

module.exports = mongoose.model('Trip', TripsSchema);