const ExpressError = require('./ExpressError');
const { getUser } = require('../newDatabase/AccountsDB');
const { getProduct } = require('../newDatabase/ProductDB');

module.exports.getOrderObject = async (userId, productId, alternateId, quantity) => {
	const user = await getUser(userId);
	const product = await getProduct(user.username, productId);
	const fullProduct = await product.populate('stock');
	const alternate = fullProduct.stock.find((alt) => alt._id.toHexString() === alternateId);
	if (alternate.quantity < quantity)
		throw new ExpressError(`Error: Only ${alternate.quantity} available`, 300);
	const orderItem = { quantity, product: fullProduct, alternate };
	return orderItem;
};
