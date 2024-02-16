const { getUser } = require('../newDatabase/AccountsDB');
const { getAllProducts, getProduct } = require('../newDatabase/ProductDB');
const { getOrder, getAllOrders } = require('../newDatabase/OrdersDB');

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

module.exports.renderNewProduct = async (req, res) => {
	res.render('users/newProduct');
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

module.exports.renderOverview = async (req, res) => {
	const { id } = req.params;
	let { cart, shippingMethod, cartDetails } = req.session;
	console.log(cart);
	console.log(shippingMethod);
	console.log(cartDetails);
	if (!shippingMethod) shippingMethod = null;
	res.render('users/orderOverview', { id, cart, shippingMethod, cartDetails });
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
