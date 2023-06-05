const Product = require('../newModels/Product');

module.exports.getAllProducts = async (storeID) => {
	const products = await Product.find({ store: storeID });
	return products;
};

module.exports.getProduct = async (id) => {
	const product = await Product.findById(id);
	return product;
};

module.exports.deleteProduct = async (id) => {
	const product = await Product.findByIdAndDelete(id);
};

module.exports.createProduct = async (storeID, product) => {
	let startingPrice = product.stock[0].price;
	let startingAlternate = product.stock[0].alternate;
	for (let stock of product.stock) {
		console.log(stock.price);
		if (stock.price < startingPrice) {
			startingPrice = stock.price;
			startingAlternate = stock.alternate;
		}
	}
	product.store = storeID;
	product.startingPrice = startingPrice;
	product.startingAlternate = startingAlternate;
	const newProduct = await Product.create(product);
	return newProduct;
};

module.exports.updateProduct = async (productId, update) => {
	const updated = await Product.findByIdAndUpdate(productId, update);
	return updated;
};
