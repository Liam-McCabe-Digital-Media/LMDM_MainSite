const { getAllProducts, getProduct } = require('../database/UserDB');

module.exports.getProductFromDB = async (req, res) => {
	const id = req.params.id;
	const { store } = req.body;
	const product = await getProduct(store, id);
	return res.json(product);
};

module.exports.removeFromCart = async (req, res) => {
	const { store } = req.body;
	const { productID, alternateID } = req.body.cartProduct;
	return req.json({ productID, alternateID });
};

module.exports.addProductToCart = async (req, res) => {
	console.log('before');
	const { store } = req.body;
	const { quantity, alternateID, productID } = req.body.cartProduct;
	console.log(quantity);
	console.log(alternateID);
	console.log(productID);
	let alternate = null;
	const product = await getProduct(store, productID);
	const fullProduct = await product.populate('stock');
	if (alternateID) {
		console.log('if');
		alternate = fullProduct.stock.find((alt) => alt._id.toHexString() === alternateID);
	} else {
		alternate = fullProduct.stock.find((alt) => alt.alternate === fullProduct.startingAlternate);
		console.log('else');
	}
	console.log('here');
	let cartObj = { quantity, product, alternate };
	console.log(cartObj);
	return res.json(cartObj);
};

module.exports.getAllProductsFromDB = async (req, res) => {
	const { store } = req.body;
	const products = await getAllProducts(store);
	return res.json(products);
};
