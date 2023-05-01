const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	alternateID: {
		type: String,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
