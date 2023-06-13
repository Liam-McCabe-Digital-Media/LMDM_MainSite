const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	address: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Address',
		required: false,
	},
	email: {
		type: String,
		required: true,
	},
	phone: {
		type: Number,
		required: false,
	},
	marketing: {
		type: Boolean,
		required: true,
		default: false,
	},
});

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;
