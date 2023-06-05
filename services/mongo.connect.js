const mongoose = require('mongoose');

const mongoOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	autoIndex: true,
	connectTimeoutMS: 10000,
	socketTimeoutMS: 30000,
};

//returns a promise containing the mongoose connection
const connectDB = () => {
	return new Promise((resolve, reject) => {
		const mongoURL = `mongodb://127.0.0.1/LMDM_Database`;
		// const mongoURL = `mongodb://127.0.0.1/UserInformation`;
		mongoose
			.connect(mongoURL, mongoOptions)
			.then((conn) => {
				console.log('connected');
				resolve(conn);
			})
			.catch((error) => reject(error));
	});
};

module.exports = connectDB;
