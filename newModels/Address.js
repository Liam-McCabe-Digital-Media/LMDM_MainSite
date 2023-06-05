const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
	street: {
		type: String,
		required: true,
	},
	streetTwo: {
		type: String,
		required: false,
	},
	city: {
		type: String,
		required: true,
	},
	zipcode: {
		type: Number,
		required: true,
	},
	state: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Address', AddressSchema);
