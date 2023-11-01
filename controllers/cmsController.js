const express = require('express');
const { getUser, getShipmentObjects } = require('../newDatabase/AccountsDB');
const {
	getAllProducts,
	createProduct,
	getProduct,
	deleteProduct,
	updateProduct,
} = require('../newDatabase/ProductDB');
const { getOrderObject } = require('../utils/orders');
const { createAddress, updateAddress } = require('../newDatabase/AddressDB');
const { createCustomer } = require('../newDatabase/CustomerDB');
const { getRatesWithShipmentDetails, getLabelFromRate } = require('../utils/ShipEngine');
const {
	createOrder,
	createOrderNoShipping,
	getOrder,
	getAllOrders,
} = require('../newDatabase/OrdersDB');

module.exports.deleteProductMethod = async (req, res) => {
	const { id, productId } = req.params;
	deleteProduct(productId);
	res.redirect(`/users/${id}/products`);
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
	const product = await getProduct(productId);
	res.render('users/viewProduct', { user, product, cart: false });
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
	return res.redirect(`/users/${id}/orders/newOrder`);
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

module.exports.renderPaymentSelect = async (req, res) => {
	const { id } = req.params;
	const user = await getUser(id);
	res.render('users/paymentSelect', { user });
};

module.exports.renderShippingInfo = async (req, res) => {
	const { id } = req.params;
	const user = await getUser(id);
	res.render('users/shippingInfo', { user });
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
	res.redirect(`/users/${id}/orders/newOrder`);
};

module.exports.updateCartQuantity = async (req, res) => {
	const { id, alternateId } = req.params;
	const { quantity } = req.body;
	req.session.cart.find((item) => {
		if (item.alternate._id === alternateId) {
			if (item.alternate.quantity >= quantity) {
				item.quantity = quantity;
			} else {
				req.flash('error', 'Quantity not available');
			}
		}
	});
	res.redirect(`/users/${id}/orders/newOrder`);
};

module.exports.renderViewProductForCart = async (req, res) => {
	const { id, productId } = req.params;
	const user = await getUser(id);
	const product = await getProduct(productId);
	res.render('users/viewProduct', { user, product, cart: true });
};

module.exports.renderOrders = async (req, res) => {
	const user = await getUser(req.params.id);
	const orders = await getAllOrders(user._id);
	res.render('users/orders', { user, orders });
};

module.exports.renderDashboard = async (req, res) => {
	const user = await getUser(req.params.id);
	const products = await getAllProducts(user._id);
	//changed rendered product list by using req.locals (idea)
	res.render('users/dashboard', { user, products });
};

module.exports.renderDashboardTw = async (req, res) => {
	const user = await getUser(req.params.id);
	// const products = await getAllProducts(user._id);
	res.render('tailwind/dashboard', { user });
};

module.exports.renderProductsTW = async (req, res) => {
	const user = await getUser(req.params.id);
	const products = await getAllProducts(user.id);
	res.render('tailwind/products', { user, products });
	// res.render('tailwind/testProd', { user });
};

module.exports.renderEditProductTW = async (req, res) => {
	const { id, productId } = req.params;
	const user = await getUser(id);
	const product = await getProduct(productId);
	res.render('tailwind/editProduct', { user, product });
};

module.exports.renderNewProductTW = async (req, res) => {
	const { id } = req.params;
	const user = await getUser(id);
	res.render('tailwind/newProduct', { user });
};

module.exports.renderOrdersTW = async (req, res) => {
	const { id } = req.params;
	const user = await getUser(id);
	const orders = await getAllOrders(id);
	res.render('tailwind/orders', { user, orders });
};

module.exports.renderNewOrderTw = async (req, res) => {
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
	res.render('tailwind/newOrder', {
		user,
		products,
		productList: req.session.cart,
		details: req.session.cartDetails,
	});
};

module.exports.renderViewProductTw = async (req, res) => {
	const { id, productId } = req.params;
	const user = await getUser(id);
	const product = await getProduct(productId);
	res.render('tailwind/editProduct', {
		user,
		product,
		productList: req.session.cart,
		details: req.session.cartDetails,
	});
};

module.exports.renderViewProductForCartTw = async (req, res) => {
	const { id, productId } = req.params;
	const user = await getUser(id);
	const product = await getProduct(productId);
	res.render('tailwind/viewProduct', { user, product, cart: true });
};

module.exports.renderShippingInfoTw = async (req, res) => {
	const { id } = req.params;
	const user = await getUser(id);
	res.render('tailwind/shippingInfo', { user });
};

module.exports.renderProfile = async (req, res) => {
	const user = await getUser(req.params.id);
	await user.populate('address');
	res.render('users/profile', { user });
};

module.exports.renderEditShipping = async (req, res) => {
	const user = await getUser(req.params.id);
	if (user.address) await user.populate('address');
	res.render('users/editShipping', { user });
};

module.exports.saveShippingInfo = async (req, res) => {
	const user = await getUser(req.params.id);
	await user.populate('address');
	if (user.address) {
		await updateAddress(user.address._id, req.body);
	} else {
		let newAddress = await createAddress(req.body);
		user.address = newAddress._id;
		await user.save();
	}
	res.redirect(`/users/${user._id}/profile`);
};

module.exports.calculateRates = async (req, res) => {
	const user = await getUser(req.params.id);
	const shipFrom = await getShipmentObjects(user);
	const { street, streetTwo, city, zipcode, state } = req.body.address;
	const { firstName, lastName, phone, email } = req.body.customer;
	req.session.customer = req.body.customer;
	req.session.customerAddress = req.body.address;
	const { cartDetails } = req.session;
	const shipTo = {
		name: `${firstName} ${lastName}`,
		phone,
		addressLine1: street,
		addressLine2: streetTwo,
		cityLocality: city,
		stateProvince: state,
		postalCode: zipcode,
		countryCode: 'US',
		addressResidentialIndicator: 'yes',
	};
	const rates = await getRatesWithShipmentDetails(shipTo, shipFrom);
	// res.send(rates);
	res.render('users/selectShippingMethod', { user, rates, shipTo, cartDetails });
};

module.exports.applyShipping = async (req, res) => {
	const { selectedShipping } = req.body;
	const { id } = req.params;
	req.session.shippingMethod = selectedShipping;
	req.session.cartDetails.shippingCost = JSON.parse(selectedShipping).shippingAmount.amount;
	// res.redirect(label.labelDownload.href);
	console.log(JSON.stringify(req.session));
	res.redirect(`/users/${id}/orders/overview`);
};

module.exports.renderOverview = async (req, res) => {
	const { id } = req.params;
	let { cart, shippingMethod, cartDetails } = req.session;
	console.log('shipping Method' + shippingMethod);
	if (!shippingMethod) shippingMethod = null;
	res.render('users/orderOverview', { id, cart, shippingMethod, cartDetails });
};

module.exports.finalizeOrder = async (req, res) => {
	const { id } = req.params;
	const { cart, cartDetails, customer, customerAddress, shippingMethod } = req.session;
	const newCustomer = await createCustomer(customer, customerAddress);
	console.log('LOOK HERE ' + typeof shippingMethod);
	req.session.cart = null;
	req.session.cartDetails = null;
	req.session.customer = null;
	req.session.customerAddress = null;
	req.session.shippingMethod = null;
	if (typeof shippingMethod !== typeof undefined) {
		const params = {
			rateId: JSON.parse(shippingMethod).rateId,
			validateAddress: 'no_validation',
			labelLayout: '4x6',
			labelFormat: 'pdf',
			labelDownloadType: 'url',
			displayScheme: 'label',
		};
		const label = await getLabelFromRate(params);
		const newOrder = await createOrder(id, cart, cartDetails, newCustomer, shippingMethod, label);
		res.redirect(`/users/${id}/orders/${newOrder._id}/confirmation`);
	} else {
		const newOrder = await createOrderNoShipping(id, cart, cartDetails, newCustomer);
		res.redirect(`/users/${id}/orders/${newOrder._id}/confirmation`);
	}
	//need to assingn shippingMethod to orderschema and fix routes from information pages
};

module.exports.confirmCusomerInfo = async (req, res) => {
	const { customer } = req.body;
	const { id } = req.params;
	const { cart, cartDetails } = req.session;
	req.session.customer = customer;

	// const newCustomer = await createCustomer(customer);
	// const order = await createOrder(id, cart, cartDetails, newCustomer);
	res.redirect(`/users/${id}/orders/overview`);
};

module.exports.renderOrderConfirmation = async (req, res) => {
	const { id, orderId } = req.params;
	const order = await getOrder(orderId);
	let labelLink = null;
	try {
		const labelLink = order.fulfillment.shippingLabel.labelDownload.href;
	} catch (e) {
		labelLink = null;
	}
	res.render('users/orderConfirmation', { id, orderId, labelLink });
};

module.exports.renderCustomerInfo = async (req, res) => {
	const { id } = req.params;
	const user = await getUser(id);
	res.render('users/customerInfo', { user });
};
