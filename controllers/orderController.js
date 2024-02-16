const { getUser, getShipmentObjects } = require('../newDatabase/AccountsDB');
const { getOrderObject } = require('../utils/orders');
const { createAddress, updateAddress } = require('../newDatabase/AddressDB');
const { createCustomer } = require('../newDatabase/CustomerDB');
const { getRatesWithShipmentDetails, getLabelFromRate } = require('../utils/ShipEngine');
const { createOrder, createOrderNoShipping } = require('../newDatabase/OrdersDB');

module.exports.calculateRatesTw = async (req, res) => {
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
	res.render('tailwind/selectShippingMethod', { user, rates, shipTo, cartDetails });
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
		cartDetails.shippingCost = 0;
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
