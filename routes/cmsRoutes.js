const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const {isLoggedIn, verifyUser} = require('../middleware');
const {getUser} = require('../database/AccountsDB');
const {getAllProducts, createProduct, getProduct} = require('../database/UserDB');

//renders the dashboard populated with user '/:id' information pulled from database
router.get('/:id/dashboard', isLoggedIn, verifyUser, catchAsync(async (req, res) => {
    const user = await getUser(req.params.id);
    const products = await getAllProducts(user.username);
    //changed rendered product list by using req.locals (idea)
    res.render('users/dashboard', {user, products});
}));

router.get('/:id/new', isLoggedIn, verifyUser, catchAsync(async (req, res) => {
    res.render('users/newProduct');
}));

router.post('/:id/new', isLoggedIn, verifyUser, catchAsync(async (req, res) => {
    const product = req.body;
    const newProduct = await createProduct(req.user.username, product);
    const {id} = req.params;
    req.flash('success', 'New Product Created');
    res.redirect(`/users/${id}/dashboard`);
}));

// router.get('/:id', isLoggedIn, verifyUser, catchAsync(async (req, res) => {
//     const {id} = req.params;
//     const product = await getProduct(id);
//     res.render('users/viewProduct', {product});
// }));


module.exports = router;