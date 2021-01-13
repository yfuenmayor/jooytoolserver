const mongoose = require('mongoose');

const ShippingSchema = mongoose.Schema({ });

module.exports = mongoose.model('Shippingorder', ShippingSchema,'shippingorders');