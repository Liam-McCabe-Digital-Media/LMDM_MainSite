const express = require('express');
const router = express.Router();
const catchAsync = require('../../utils/catchAsync');
const { verifyKey, postVerifyKey } = require('../../newDatabase/KeysDB');

const {
	getProductFromDB,
	getAllProductsFromDB,
	removeFromCart,
	addProductToCart,
} = require('../../controllers/apiControllers');

//this is the api call to
//localhost:3000/api/allProducts?store=[username]&key=[apiKey]\

//need to verify apikey is valid and matches storeID
//this will be done in verifyKey middleware

router.post('/allProducts', postVerifyKey, catchAsync(getAllProductsFromDB));

router.post('/addToCart', postVerifyKey, catchAsync(addProductToCart));

router.post('/removeFromCart', postVerifyKey, catchAsync(removeFromCart));

router.post('/:id', postVerifyKey, catchAsync(getProductFromDB));

// router.post('/getShippingRates', postVerifyKey, catchAsync(getShippingRates));

module.exports = router;
