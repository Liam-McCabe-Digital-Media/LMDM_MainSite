const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	zip: {
		type: Number,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phone: {
		type: Number,
		required: true,
	},
	marketing: {
		type: Boolean,
		required: true,
		default: false,
	},
});

const Customer = Mongoose.model('Customer', customerSchema);
module.exports = Customer;
