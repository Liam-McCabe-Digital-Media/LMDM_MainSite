const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	store: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	startingPrice: {
		type: Number,
		required: true,
	},
	startingAlternate: {
		type: String,
		required: true,
	},
	stock: {
		type: [
			{
				alternate: { type: String, required: true },
				quantity: { type: Number, required: true },
				price: { type: Number, required: true },
			},
		],
		required: true,
	},
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
