const express = require('express');
const { getUser } = require('../newDatabase/AccountsDB');
const {
	getAllProducts,
	createProduct,
	getProduct,
	deleteProduct,
	updateProduct,
} = require('../newDatabase/ProductDB');
const { getOrderObject } = require('../utils/orders');

module.exports.deleteProductMethod = async (req, res) => {
	const { id, productId } = req.params;
	deleteProduct(productId);
	res.redirect(`/users/${id}/dashboard`);
};

module.exports.modifyProduct = async (req, res) => {
	const { id, productId } = req.params;
	let updated = req.body;
	updated.store = id;
	const product = await updateProduct(productId, updated);
	res.redirect(`/users/${id}/${productId}`);
};

module.exports.renderEdit = async (req, res) => {
	const { id, productId } = req.params;
	const product = await getProduct(productId);
	res.render('users/editProduct', { product });
};

module.exports.renderViewProduct = async (req, res) => {
	const { id, productId } = req.params;
	const user = await getUser(id);
	const product = await getProduct(req.user.username, productId);
	res.render('users/viewProduct', { product, cart: false });
};

module.exports.createNewProduct = async (req, res) => {
	const product = req.body;
	product.store = req.user._id;
	const newProduct = await createProduct(req.user._id, product);
	const { id } = req.params;
	req.flash('success', 'New Product Created');
	res.redirect(`/users/${id}/dashboard`);
};

module.exports.renderNewProduct = async (req, res) => {
	res.render('users/newProduct');
};

module.exports.removeAlternateFromCart = (req, res) => {
	const alternateId = req.params.alternateId;
	const id = req.params.id;
	req.session.cart.splice(
		req.session.cart.findIndex((item) => item.alternate._id === alternateId),
		1,
	);
	//need to fix redirect giving cannot change headers
	return res.redirect(`/users/${id}/newOrder`);
};

module.exports.renderNewOrder = async (req, res) => {
	const user = await getUser(req.params.id);
	const products = await getAllProducts(user._id);
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
};

module.exports.addAlternateToOrder = async (req, res) => {
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
};

module.exports.renderViewProductForCart = async (req, res) => {
	const { id, productId } = req.params;
	const user = await getUser(id);
	const product = await getProduct(productId);
	res.render('users/viewProduct', { user, product, cart: true });
};

module.exports.renderOrders = async (req, res) => {
	const user = await getUser(req.params.id);
	res.render('users/orders', { user });
};

module.exports.renderDashboard = async (req, res) => {
	const user = await getUser(req.params.id);
	const products = await getAllProducts(user._id);
	//changed rendered product list by using req.locals (idea)
	res.render('users/dashboard', { user, products });
};
