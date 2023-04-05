const express = require('express');
const router = express.Router();
const catchAsync = require('../../utils/catchAsync');
const {getAllProducts} = require('../../database/UserDB');
const {verifyKey} = require('../../database/KeysDB');
//this is the api call to
//localhost:3000/api/allProducts?store=[username]&key=[apiKey]\

//need to verify apikey is valid and matches storeID
//this will be done in verifyKey middleware

router.get('/allProducts', verifyKey, catchAsync(async(req, res) => {
    const store = req.query.store;
    const apiKey = req.query.key;

    if(store && apiKey){
        const products = await getAllProducts(store);
        // const jsonString = JSON.stringify(products);
        return res.json(products);
    }
    res.send('error')
}));

module.exports = router;