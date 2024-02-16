const { getUser } = require('../newDatabase/AccountsDB');
const { getAllProducts, getProduct } = require('../newDatabase/ProductDB');
const { getOrder, getAllOrders } = require('../newDatabase/OrdersDB');

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

module.exports.renderCustomerInfoTw = async (req, res) => {
	const { id } = req.params;
	const user = await getUser(id);
	res.render('tailwind/customerInfo', { user });
};

module.exports.renderProfileTw = async (req, res) => {
	const user = await getUser(req.params.id);
	await user.populate('address');
	res.render('tailwind/profile', { user });
};

module.exports.renderEditProfileTw = async (req, res) => {
	const user = await getUser(req.params.id);
	await user.populate('address');
	res.render('tailwind/editProfile', { user });
};

module.exports.renderOverviewTw = async (req, res) => {
	const { id } = req.params;
	let { cart, shippingMethod, cartDetails } = req.session;
	const user = await getUser(id);
	console.log('shipping Method' + shippingMethod);
	if (!shippingMethod) shippingMethod = null;
	res.render('tailwind/orderOverview', { user, cart, shippingMethod, cartDetails });
};

module.exports.renderOrderConfirmationTw = async (req, res) => {
	const { id, orderId } = req.params;
	const order = await getOrder(orderId);
	const user = await getUser(id);
	let labelLink = null;
	try {
		labelLink = order.fulfillment.shippingLabel.labelDownload.href;
	} catch (e) {
		labelLink = null;
	}
	res.render('tailwind/orderConfirmation', { user, orderId, labelLink });
};

module.exports.renderViewOrderTw = async (req, res) => {
	const { id, orderId } = req.params;
	const order = await getOrder(orderId);
	const user = await getUser(id);
	let labelLink = null;
	try {
		labelLink = order.fulfillment.shoppingLabel.labelDownload.href;
	} catch (e) {
		labelLink = null;
	}
	console.log(order);
	res.render('tailwind/viewOrder', { user, order, labelLink });
};
