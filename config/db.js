require('dotenv').config({ path:'variables.env' });
const mongoose = require('mongoose');

const conectarDB = async () => {
    try{
		const db = await mongoose.connect(process.env.DB_MONGO_QA,{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		});
		console.log('DB is connected to: ', db.connection.name);
	} catch (error) {
		console.log(error); //mostramos error
		process.exit(1); //detenemos el server
	}
}

module.exports = conectarDB;