const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const { isLoggedIn, verifyUser } = require('../middleware');
const { getUser } = require('../database/AccountsDB');
const {
	getAllProducts,
	createProduct,
	getProduct,
	deleteProduct,
	updateProduct,
} = require('../database/UserDB');
const { getOrderObject } = require('../utils/orders');
//renders the dashboard populated with user '/:id' information pulled from database
router.get(
	'/:id/dashboard',
	isLoggedIn,
	verifyUser,
	catchAsync(async (req, res) => {
		const user = await getUser(req.params.id);
		const products = await getAllProducts(user.username);
		//changed rendered product list by using req.locals (idea)
		res.render('users/dashboard', { user, products });
	}),
);

router.get(
	'/:id/orders',
	isLoggedIn,
	verifyUser,
	catchAsync(async (req, res) => {
		const user = await getUser(req.params.id);
		res.render('users/orders', { user });
	}),
);

router.get(
	'/:id/:productId/viewProduct',
	isLoggedIn,
	verifyUser,
	catchAsync(async (req, res) => {
		const { id, productId } = req.params;
		const user = await getUser(id);
		const product = await getProduct(req.user.username, productId);
		res.render('users/viewProduct', { user, product, cart: true });
	}),
);

router.post(
	'/:id/:productId/:alternateId/addToOrder',
	isLoggedIn,
	verifyUser,
	catchAsync(async (req, res) => {
		const { id, productId, alternateId } = req.params;
		console.log(req.body.quantity);
		const { quantity } = req.body;
		if (req.session.cart.find((item) => item.alternate._id === alternateId)) {
			req.flash('error', 'Item already in cart');
		} else {
			let orderObject = await getOrderObject(id, productId, alternateId, quantity);
			if (req.session.cart == null) req.session.cart = [];
			req.session.cart.push(orderObject);
			console.log('cart:' + req.session.cart);
			req.flash('success', `added ${orderObject.product.name} to order`);
		}
		res.redirect(`/users/${id}/newOrder`);
	}),
);

router.get(
	'/:id/newOrder',
	isLoggedIn,
	verifyUser,
	catchAsync(async (req, res) => {
		const user = await getUser(req.params.id);
		const products = await getAllProducts(user.username);
		if (!req.session.cart) req.session.cart = [];
		req.session.cartDetails = {
			total: 0,
			itemCount: 0,
		};
		if (req.session.cart.length != 0)
			for (let cartObject of req.session.cart) {
				req.session.cartDetails.total += cartObject.quantity * cartObject.alternate.price;
				req.session.cartDetails.itemCount += cartObject.quantity;
			}
		res.render('users/newOrder', {
			user,
			products,
			productList: req.session.cart,
			details: req.session.cartDetails,
		});
	}),
);

router.delete(
	'/:id/removeFromCart/:productId/:alternateId',
	isLoggedIn,
	verifyUser,
	catchAsync((req, res) => {
		const alternateId = req.params.alternateId;
		const id = req.params.id;
		req.session.cart.splice(
			req.session.cart.findIndex((item) => item.alternate._id === alternateId),
			1,
		);
		//need to fix redirect giving cannot change headers
		res.redirect(`/users/${id}/newOrder`);
	}),
);

router.get(
	'/:id/new',
	isLoggedIn,
	verifyUser,
	catchAsync(async (req, res) => {
		res.render('users/newProduct');
	}),
);

router.post(
	'/:id/new',
	isLoggedIn,
	verifyUser,
	catchAsync(async (req, res) => {
		const product = req.body;
		const newProduct = await createProduct(req.user.username, product);
		const { id } = req.params;
		req.flash('success', 'New Product Created');
		res.redirect(`/users/${id}/dashboard`);
	}),
);

router.get(
	'/:id/:productId',
	isLoggedIn,
	verifyUser,
	catchAsync(async (req, res) => {
		const { id, productId } = req.params;
		const user = await getUser(id);
		const product = await getProduct(req.user.username, productId);
		res.render('users/viewProduct', { product, cart: false });
	}),
);

router.get(
	'/:id/:productId/edit',
	isLoggedIn,
	verifyUser,
	catchAsync(async (req, res) => {
		const { id, productId } = req.params;
		const product = await getProduct(req.user.username, productId);
		res.render('users/editProduct', { product });
	}),
);

router.post(
	'/:id/:productId/edit',
	isLoggedIn,
	verifyUser,
	catchAsync(async (req, res) => {
		const { id, productId } = req.params;
		const product = await updateProduct(req.user.username, productId, req.body);
		res.redirect(`/users/${id}/${productId}`);
	}),
);

router.delete(
	'/:id/:productId',
	isLoggedIn,
	verifyUser,
	catchAsync(async (req, res) => {
		const { id, productId } = req.params;
		deleteProduct(req.user.username, productId);
		res.redirect(`/users/${id}/dashboard`);
	}),
);

module.exports = router;
