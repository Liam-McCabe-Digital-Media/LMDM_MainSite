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
	renderNewOrder,
	addAlternateToOrder,
	renderOrders,
	renderDashboard,
} = require('../controllers/cmsController');

//renders the dashboard populated with user '/:id' information pulled from database
router.get('/:id/dashboard', isLoggedIn, verifyUser, catchAsync(renderDashboard));

router.get('/:id/orders', isLoggedIn, verifyUser, catchAsync(renderOrders));

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

router.get('/:id/newOrder', isLoggedIn, verifyUser, catchAsync(renderNewOrder));

router.delete(
	'/:id/removeFromCart/:productId/:alternateId',
	isLoggedIn,
	verifyUser,
	catchAsync(removeAlternateFromCart),
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
