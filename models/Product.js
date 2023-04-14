const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
