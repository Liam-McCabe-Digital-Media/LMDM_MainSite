const express = require('express');
const router = express.Router();
const catchAsync = require('../../utils/catchAsync');
const {getAllProducts, getProduct} = require('../../database/UserDB');
const {verifyKey} = require('../../database/KeysDB');
//this is the api call to
//localhost:3000/api/allProducts?store=[username]&key=[apiKey]\

//need to verify apikey is valid and matches storeID
//this will be done in verifyKey middleware

router.get('/allProducts', verifyKey, catchAsync(async(req, res) => {
    const {store} = req.query
    const products = await getAllProducts(store);
    return res.json(products);
}));

router.get('/:id', verifyKey, catchAsync(async(req, res) => {
    const id = req.params.id;
    const {store} = req.query;
    const product = await getProduct(store, id);
    return res.json(product);
}));

module.exports = router;