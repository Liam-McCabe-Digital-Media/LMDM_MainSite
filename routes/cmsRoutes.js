const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, verifyUser } = require('../middleware');

const {
	deleteProductMethod,
	modifyProduct,
	renderEdit,
	renderViewProduct,
	renderViewProductForCart,
	createNewProduct,
	renderNewProduct,
	removeAlternateFromCart,
	addAlternateToOrder,
	renderDashboard,
	renderNewOrder,
	renderOrders,
	renderPaymentSelect,
	renderShippingInfo,
	updateCartQuantity,
	renderProfile,
	renderEditShipping,
	saveShippingInfo,
	calculateRates,
	renderCustomerInfo,
	createOrderNoShipping,
	createOrder,
} = require('../controllers/cmsController');

router.get('/:id/profile', isLoggedIn, verifyUser, catchAsync(renderProfile));
router.get('/:id/profile/editShipping', isLoggedIn, verifyUser, catchAsync(renderEditShipping));
router.post('/:id/profile/editShipping', isLoggedIn, verifyUser, catchAsync(saveShippingInfo));
router.post('/:id/');
router.get('/:id/orders', isLoggedIn, verifyUser, catchAsync(renderOrders));

router.get('/:id/orders/newOrder', isLoggedIn, verifyUser, catchAsync(renderNewOrder));

router.get('/:id/orders/selectPayment', isLoggedIn, verifyUser, catchAsync(renderPaymentSelect));

router.get('/:id/orders/shippingInfo', isLoggedIn, verifyUser, catchAsync(renderShippingInfo));
router.post('/:id/orders/shippingInfo', isLoggedIn, verifyUser, catchAsync(calculateRates));
router.get('/:id/orders/customerInfo', isLoggedIn, verifyUser, catchAsync(renderCustomerInfo));
router.post('/:id/orders/customerInfo', isLoggedIn, verifyUser, catchAsync(createOrderNoShipping));
//renders the dashboard populated with user '/:id' information pulled from database
router.get('/:id/dashboard', isLoggedIn, verifyUser, catchAsync(renderDashboard));

router.get(
	'/:id/:productId/viewProduct',
	isLoggedIn,
	verifyUser,
	catchAsync(renderViewProductForCart),
);

router.post(
	'/:id/:productId/:alternateId/addToOrder',
	isLoggedIn,
	verifyUser,
	catchAsync(addAlternateToOrder),
);

router.delete(
	'/:id/removeFromCart/:productId/:alternateId',
	isLoggedIn,
	verifyUser,
	catchAsync(removeAlternateFromCart),
);

router.put(
	'/:id/updateQuantity/:alternateId',
	isLoggedIn,
	verifyUser,
	catchAsync(updateCartQuantity),
);
router
	.route('/:id/new')
	.get(isLoggedIn, verifyUser, catchAsync(renderNewProduct))
	.post(isLoggedIn, verifyUser, catchAsync(createNewProduct));

router
	.route('/:id/:productId')
	.get(isLoggedIn, verifyUser, catchAsync(renderViewProduct))
	.post(isLoggedIn, verifyUser, catchAsync(modifyProduct))
	.delete(isLoggedIn, verifyUser, catchAsync(deleteProductMethod));

router.get('/:id/:productId/edit', isLoggedIn, verifyUser, catchAsync(renderEdit));

module.exports = router;
