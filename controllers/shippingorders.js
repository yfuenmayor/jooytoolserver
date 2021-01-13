const ShippingModel  = require('../models/Shippingorders')


exports.statusDevices = async (req, res) => {

    const { Ruts } = req.body;
    const orders = [];
    const select = {provider: 1, shippingInfo:1 , tracking:1, _id:0};

    try {
        //Peticion de ordenes
        await Promise.all(Ruts.map( async (rut) => {
            const  order = await ShippingModel.find({"shippingInfo.rut": rut}, select).sort({_id:-1}).limit(1);
            order.map( el => { orders.push(el) });
            return order
        }));
        
        res.json({ orders });

    } catch (e) {
        console.log(e.message);
    }


}