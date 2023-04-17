const { switchDB, getDBModel } = require('../database/index');
const Product = require('../models/Product');
const ProductSchemas = new Map([['Product', Product.schema]]);

module.exports.getAllProducts = async (username) => {
	const dbName = `LMDM_${username}`;
	const productDB = await switchDB(dbName, ProductSchemas);
	const productModel = await getDBModel(productDB, 'Product');
	const products = await productModel.find();
	return products;
};

module.exports.getProduct = async (store, id) => {
	const dbName = `LMDM_${store}`;
	const productDB = await switchDB(dbName, ProductSchemas);
	const productModel = await getDBModel(productDB, 'Product');
	const product = await productModel.findById(id);
	return product;
};

module.exports.deleteProduct = async (store, id) => {
	const dbName = `LMDM_${store}`;
	const productDB = await switchDB(dbName, ProductSchemas);
	const productModel = await getDBModel(productDB, 'Product');
	const product = await productModel.findByIdAndDelete(id);
};

module.exports.createProduct = async (store, product) => {
	const dbName = `LMDM_${store}`;
	let startingPrice = product.stock[0].price;
	let startingAlternate = product.stock[0].alternate;
	for (let stock of product.stock) {
		console.log(stock.price);
		if (stock.price < startingPrice) {
			startingPrice = stock.price;
			startingAlternate = stock.alternate;
		}
	}
	product.startingPrice = startingPrice;
	product.startingAlternate = startingAlternate;
	const productDB = await switchDB(dbName, ProductSchemas);
	const productModel = await getDBModel(productDB, 'Product');
	const newProduct = await productModel.create(product);
	return newProduct;
};

module.exports.updateProduct = async (store, productId, update) => {
	const dbName = `LMDM_${store}`;
	const productDB = await switchDB(dbName, ProductSchemas);
	const productModel = await getDBModel(productDB, 'Product');
	const updated = await productModel.findByIdAndUpdate(productId, update);
	return updated;
};
