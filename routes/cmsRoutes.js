const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const {isLoggedIn, verifyUser} = require('../middleware');
const {getUser} = require('../database/AccountsDB');
const {getAllProducts, createProduct, getProduct, deleteProduct, updateProduct} = require('../database/UserDB');

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

router.get('/:id/:productId', isLoggedIn, verifyUser, catchAsync(async (req, res) => {
    const {id, productId} = req.params;
    const user = await getUser(id);
    const product = await getProduct(req.user.username, productId);
    res.render('users/viewProduct', {product, user});
}));

router.get('/:id/:productId/edit', isLoggedIn, verifyUser, catchAsync(async (req, res) => {
    const {id, productId} = req.params;
    const user = await getUser(id);
    const product = await getProduct(req.user.username, productId);
    res.render('users/editProduct', {product, user});
}));

router.post('/:id/:productId/edit', isLoggedIn, verifyUser, catchAsync(async (req, res) => {
    const {id, productId} = req.params;
    const product = await updateProduct(req.user.username, productId, req.body);
    res.redirect(`/users/${id}/${productId}`);
}))

router.delete('/:id/:productId', isLoggedIn, verifyUser, catchAsync(async (req, res) => {
    const {id, productId} = req.params;
    deleteProduct(req.user.username, productId);
    res.redirect(`/users/${id}/dashboard`);
}));


module.exports = router;