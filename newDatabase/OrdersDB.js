const Order = require('../newModels/Order');

module.exports.createOrder = async (cart, cartDetails, customer) => {
	const newOrder = await Order.create({
		customer: customer._id,
		orderContent: cart,
		orderDetails: cartDetails,
	});
	return newOrder;
};

module.exports.createOrder = async (cart, cartDetails, customer, shippingMethod) => {
	const newOrder = await Order.create({
		customer: customer._id,
		orderContent: cart,
		orderDetails: cartDetails,
		fulfillment: {
			method: 'UPS',
			planned: shippingMethod.estimatedDeliveryDate,
		},
	});
	console.log(newOrder);
	return newOrder;
};
