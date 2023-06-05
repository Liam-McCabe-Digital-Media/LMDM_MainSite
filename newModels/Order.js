const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	orderContent: {
		type: Object,
		required: true,
	},
	orderDetails: {
		type: Object,
		required: true,
	},
	payment: {
		recieved: {
			type: Boolean,
			required: true,
			default: false,
		},
		method: {
			type: String,
			enum: ['Cash', 'Digital', 'Stripe', 'Other'],
			default: 'Other',
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
			required: true,
		},
	},
	fulfillment: {
		fulfilled: {
			type: Boolean,
			required: true,
			default: false,
		},
		method: {
			type: String,
			enum: ['inPerson', 'UPS', 'other'],
			default: 'other',
			required: true,
		},
		Date: {
			type: Date,
			default: Date.now,
			required: true,
		},
		planned: {
			type: Date,
			required: false,
		},
	},
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
