const connectDB = require('../services/mongo.connect');

//switches the active Database and returns the mongoose connection
module.exports.switchDB = async (dbName, dbSchema) => {
	const mongoose = await connectDB();
	if (mongoose.connection.readyState === 1) {
		const db = mongoose.connection.useDb(dbName, { useCache: true });
		if (!Object.keys(db.models).length) {
			dbSchema.forEach((modelName, schema) => {
				db.model(schema, modelName);
			});
		}
		return db;
	}
	throw new Error('error');
};

//returns the model identifed with modelName from the indicated database
module.exports.getDBModel = async (db, modelName) => {
	return db.model(modelName);
};
