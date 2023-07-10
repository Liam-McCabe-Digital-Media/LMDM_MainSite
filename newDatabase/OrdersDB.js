const Order = require('../newModels/Order');

module.exports.createOrder = async (cart, cartDetails, customer) => {
	const newOrder = await Order.create({
		customer: customer._id,
		orderContent: cart,
		orderDetails: cartDetails,
	});
	return newOrder;
};

module.exports.createOrder = async (cart, cartDetails, customer, shippingMethod, label) => {
	const newOrder = await Order.create({
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
