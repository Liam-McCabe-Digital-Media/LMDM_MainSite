const Order = require('../newModels/Order');

module.exports.createOrder = async (content, customer) => {
	console.log(content);
	const newOrder = await Order.create({
		customer: customer._id,
		orderContent: content.cart,
		orderDetails: content.cartDetails,
	});
	return newOrder;
};
