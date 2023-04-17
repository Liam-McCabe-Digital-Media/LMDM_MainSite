const express = require('express');
const router = express.Router();
const catchAsync = require('../../utils/catchAsync');
const { getAllProducts, getProduct } = require('../../database/UserDB');
const { verifyKey, postVerifyKey } = require('../../database/KeysDB');
//this is the api call to
//localhost:3000/api/allProducts?store=[username]&key=[apiKey]\

//need to verify apikey is valid and matches storeID
//this will be done in verifyKey middleware

router.post(
	'/allProducts',
	postVerifyKey,
	catchAsync(async (req, res) => {
		const { store } = req.body;
		const products = await getAllProducts(store);
		return res.json(products);
	}),
);

router.post(
	'/addToCart',
	postVerifyKey,
	catchAsync(async (req, res) => {
		const { store } = req.body;
		const { quantity, alternateID, productID } = req.body.cartProduct;
		const product = await getProduct(store, productID);
		const fullProduct = await product.populate('stock');
		const alternate = fullProduct.stock.find((alt) => alt._id.toHexString() === alternateID);
		let cartObj = { quantity, product, alternate };
		console.log(cartObj);
		return res.json(cartObj);
	}),
);

router.post(
	'/removeFromCart',
	verifyKey,
	catchAsync(async (req, res) => {
		const { store } = req.body;
		const { productID, alternateID } = req.body.cartProduct;
		return req.json({ productID, alternateID });
	}),
);

router.post(
	'/:id',
	postVerifyKey,
	catchAsync(async (req, res) => {
		const id = req.params.id;
		const { store } = req.body;
		const product = await getProduct(store, id);
		return res.json(product);
	}),
);
// router.get(
// 	'/allProducts',
// 	verifyKey,
// 	catchAsync(async (req, res) => {
// 		const { store } = req.query;
// 		const products = await getAllProducts(store);
// 		return res.json(products);
// 	}),
// );

// router.get(
// 	'/:id',
// 	verifyKey,
// 	catchAsync(async (req, res) => {
// 		const id = req.params.id;
// 		const { store } = req.query;
// 		const product = await getProduct(store, id);
// 		return res.json(product);
// 	}),
// );

module.exports = router;
