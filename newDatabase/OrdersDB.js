const Order = require('../newModels/Order');

module.exports.createOrderNoShipping = async (userId, cart, cartDetails, customer) => {
	const newOrder = await Order.create({
		store: userId,
		customerName: { first: customer.firstName, last: customer.lastName },
		customer: customer._id,
		orderContent: cart,
		orderDetails: cartDetails,
	});
	return newOrder;
};

module.exports.createOrder = async (userId, cart, cartDetails, customer, shippingMethod, label) => {
	const newOrder = await Order.create({
		store: userId,
		customerName: { first: customer.firstName, last: customer.LastName },
		customer: customer._id,
		orderContent: cart,
		orderDetails: cartDetails,
		fulfillment: {
			method: 'UPS',
			shipping: shippingMethod,
			shippingLabel: label,
		},
	});
	console.log(newOrder);
	return newOrder;
};

module.exports.getOrder = async (id) => {
	const order = await Order.findById(id);
	return order;
};

module.exports.getAllOrders = async (userId) => {
	const orders = await Order.find({ store: userId });
	return orders;
};
