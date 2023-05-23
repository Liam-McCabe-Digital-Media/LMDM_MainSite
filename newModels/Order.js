const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
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

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
