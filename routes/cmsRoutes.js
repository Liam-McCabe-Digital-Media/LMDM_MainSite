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
	confirmCusomerInfo,
	renderOverview,
	applyShipping,
	finalizeOrder,
	renderOrderConfirmation,
	renderDashboardTw,
	renderProductsTW,
	renderEditProductTW,
	renderNewProductTW,
	renderOrdersTW,
} = require('../controllers/cmsController');
const { getUser } = require('../newDatabase/AccountsDB');
// router.get(
// 	'/:id/test',
// 	isLoggedIn,
// 	verifyUser,
// 	catchAsync(async (req, res) => {
// 		const { id } = req.params;
// 		const user = await getUser(id);
// 		const rates = {
// 			rates: [
// 				{
// 					rateId: 'se-3182336114',
// 					rateType: 'shipment',
// 					carrierId: 'se-4800261',
// 					shippingAmount: { currency: 'usd', amount: 49.46 },
// 					insuranceAmount: { currency: 'usd', amount: 0 },
// 					confirmationAmount: { currency: 'usd', amount: 0 },
// 					otherAmount: { currency: 'usd', amount: 0 },
// 					taxAmount: null,
// 					zone: null,
// 					packageType: null,
// 					deliveryDays: 1,
// 					guaranteedService: true,
// 					estimatedDeliveryDate: '2023-06-21T12:00:00Z',
// 					carrierDeliveryDays: 'Tomorrow by 12:00 PM',
// 					shipDate: '2023-06-20T00:00:00Z',
// 					negotiatedRate: false,
// 					serviceType: 'UPS Next Day Air®',
// 					serviceCode: 'ups_next_day_air',
// 					trackable: true,
// 					carrierCode: 'ups',
// 					carrierNickname: 'ShipEngine Test Account - UPS',
// 					carrierFriendlyName: 'UPS',
// 					validationStatus: 'valid',
// 					warningMessages: [],
// 					errorMessages: [],
// 				},
// 				{
// 					rateId: 'se-3182336115',
// 					rateType: 'shipment',
// 					carrierId: 'se-4800261',
// 					shippingAmount: { currency: 'usd', amount: 32.76 },
// 					insuranceAmount: { currency: 'usd', amount: 0 },
// 					confirmationAmount: { currency: 'usd', amount: 0 },
// 					otherAmount: { currency: 'usd', amount: 0 },
// 					taxAmount: null,
// 					zone: null,
// 					packageType: null,
// 					deliveryDays: 2,
// 					guaranteedService: true,
// 					estimatedDeliveryDate: '2023-06-22T23:00:00Z',
// 					carrierDeliveryDays: 'Thursday 6/22 by 11:00 PM',
// 					shipDate: '2023-06-20T00:00:00Z',
// 					negotiatedRate: false,
// 					serviceType: 'UPS 2nd Day Air®',
// 					serviceCode: 'ups_2nd_day_air',
// 					trackable: true,
// 					carrierCode: 'ups',
// 					carrierNickname: 'ShipEngine Test Account - UPS',
// 					carrierFriendlyName: 'UPS',
// 					validationStatus: 'valid',
// 					warningMessages: [],
// 					errorMessages: [],
// 				},
// 				{
// 					rateId: 'se-3182336116',
// 					rateType: 'shipment',
// 					carrierId: 'se-4800261',
// 					shippingAmount: { currency: 'usd', amount: 17.5 },
// 					insuranceAmount: { currency: 'usd', amount: 0 },
// 					confirmationAmount: { currency: 'usd', amount: 0 },
// 					otherAmount: { currency: 'usd', amount: 0 },
// 					taxAmount: null,
// 					zone: null,
// 					packageType: null,
// 					deliveryDays: 1,
// 					guaranteedService: true,
// 					estimatedDeliveryDate: '2023-06-21T23:00:00Z',
// 					carrierDeliveryDays: 'Tomorrow by 11:00 PM',
// 					shipDate: '2023-06-20T00:00:00Z',
// 					negotiatedRate: false,
// 					serviceType: 'UPS® Ground',
// 					serviceCode: 'ups_ground',
// 					trackable: true,
// 					carrierCode: 'ups',
// 					carrierNickname: 'ShipEngine Test Account - UPS',
// 					carrierFriendlyName: 'UPS',
// 					validationStatus: 'valid',
// 					warningMessages: [],
// 					errorMessages: [],
// 				},
// 				{
// 					rateId: 'se-3182336117',
// 					rateType: 'shipment',
// 					carrierId: 'se-4800261',
// 					shippingAmount: { currency: 'usd', amount: 23.35 },
// 					insuranceAmount: { currency: 'usd', amount: 0 },
// 					confirmationAmount: { currency: 'usd', amount: 0 },
// 					otherAmount: { currency: 'usd', amount: 0 },
// 					taxAmount: null,
// 					zone: null,
// 					packageType: null,
// 					deliveryDays: 3,
// 					guaranteedService: true,
// 					estimatedDeliveryDate: '2023-06-23T23:00:00Z',
// 					carrierDeliveryDays: 'Friday 6/23 by 11:00 PM',
// 					shipDate: '2023-06-20T00:00:00Z',
// 					negotiatedRate: false,
// 					serviceType: 'UPS 3 Day Select®',
// 					serviceCode: 'ups_3_day_select',
// 					trackable: true,
// 					carrierCode: 'ups',
// 					carrierNickname: 'ShipEngine Test Account - UPS',
// 					carrierFriendlyName: 'UPS',
// 					validationStatus: 'valid',
// 					warningMessages: [],
// 					errorMessages: [],
// 				},
// 				{
// 					rateId: 'se-3182336118',
// 					rateType: 'shipment',
// 					carrierId: 'se-4800261',
// 					shippingAmount: { currency: 'usd', amount: 45.78 },
// 					insuranceAmount: { currency: 'usd', amount: 0 },
// 					confirmationAmount: { currency: 'usd', amount: 0 },
// 					otherAmount: { currency: 'usd', amount: 0 },
// 					taxAmount: null,
// 					zone: null,
// 					packageType: null,
// 					deliveryDays: 1,
// 					guaranteedService: true,
// 					estimatedDeliveryDate: '2023-06-21T23:00:00Z',
// 					carrierDeliveryDays: 'Tomorrow by 11:00 PM',
// 					shipDate: '2023-06-20T00:00:00Z',
// 					negotiatedRate: false,
// 					serviceType: 'UPS Next Day Air Saver®',
// 					serviceCode: 'ups_next_day_air_saver',
// 					trackable: true,
// 					carrierCode: 'ups',
// 					carrierNickname: 'ShipEngine Test Account - UPS',
// 					carrierFriendlyName: 'UPS',
// 					validationStatus: 'valid',
// 					warningMessages: [],
// 					errorMessages: [],
// 				},
// 				{
// 					rateId: 'se-3182336119',
// 					rateType: 'shipment',
// 					carrierId: 'se-4800261',
// 					shippingAmount: { currency: 'usd', amount: 83.73 },
// 					insuranceAmount: { currency: 'usd', amount: 0 },
// 					confirmationAmount: { currency: 'usd', amount: 0 },
// 					otherAmount: { currency: 'usd', amount: 0 },
// 					taxAmount: null,
// 					zone: null,
// 					packageType: null,
// 					deliveryDays: 1,
// 					guaranteedService: true,
// 					estimatedDeliveryDate: '2023-06-21T08:00:00Z',
// 					carrierDeliveryDays: 'Tomorrow by 08:00 AM',
// 					shipDate: '2023-06-20T00:00:00Z',
// 					negotiatedRate: false,
// 					serviceType: 'UPS Next Day Air® Early',
// 					serviceCode: 'ups_next_day_air_early_am',
// 					trackable: true,
// 					carrierCode: 'ups',
// 					carrierNickname: 'ShipEngine Test Account - UPS',
// 					carrierFriendlyName: 'UPS',
// 					validationStatus: 'valid',
// 					warningMessages: [],
// 					errorMessages: [],
// 				},
// 			],
// 			invalidRates: [],
// 			rateRequestId: 'se-448459902',
// 			shipmentId: 'se-674099456',
// 			createdAt: '2023-06-20T23:49:05.6036261Z',
// 			status: 'completed',
// 			errors: [],
// 		};
// 		const shipTo = {
// 			name: 'alyssa ramos',
// 			phone: '9099025049',
// 			companyName: null,
// 			addressLine1: '14144 willamette ave',
// 			addressLine2: null,
// 			addressLine3: null,
// 			cityLocality: 'Chino',
// 			stateProvince: 'CA',
// 			postalCode: '91710',
// 			countryCode: 'US',
// 			addressResidentialIndicator: 'yes',
// 		};
// 		const { cartDetails } = req.session;
// 		res.render('users/selectShippingMethod', { user, rates, shipTo, cartDetails });
// 	}),
// );
// router.post(
// 	'/:id/test',
// 	isLoggedIn,
// 	verifyUser,
// 	catchAsync((req, res) => {
// 		console.log('correct');
// 		return res.send(req.body);
// 	}),
// );

// router.get(
// 	'/:id/test',
// 	isLoggedIn,
// 	verifyUser,
// 	catchAsync(async (req, res) => {
// 		req.session.cart = [
// 			{
// 				quantity: '1',
// 				product: {
// 					_id: '647fa78f48239a2f7fe6fc67',
// 					store: '647fa760bcfbc22c4e0796ac',
// 					name: 'decorous jacket',
// 					category: 'jacket',
// 					description: 'example description of product',
// 					startingPrice: 15,
// 					startingAlternate: 'large',
// 					stock: [{ alternate: 'large', quantity: 5, price: 15, _id: '647fa78f48239a2f7fe6fc68' }],
// 					__v: 0,
// 				},
// 				alternate: { alternate: 'large', quantity: 5, price: 15, _id: '647fa78f48239a2f7fe6fc68' },
// 			},
// 		];
// 		req.session.cartDetails = { total: 15, itemCount: '01', shippingCost: 17.5 };
// 		req.session.shippingMethod = {
// 			rateId: 'se-3219579941',
// 			rateType: 'shipment',
// 			carrierId: 'se-4800261',
// 			shippingAmount: { currency: 'usd', amount: 17.5 },
// 			insuranceAmount: { currency: 'usd', amount: 0 },
// 			confirmationAmount: { currency: 'usd', amount: 0 },
// 			otherAmount: { currency: 'usd', amount: 0 },
// 			taxAmount: null,
// 			zone: null,
// 			packageType: null,
// 			deliveryDays: 1,
// 			guaranteedService: true,
// 			estimatedDeliveryDate: '2023-07-01T23:00:00Z',
// 			carrierDeliveryDays: 'Tomorrow by 11:00 PM',
// 			shipDate: '2023-06-30T00:00:00Z',
// 			negotiatedRate: false,
// 			serviceType: 'UPS® Ground',
// 			serviceCode: 'ups_ground',
// 			trackable: true,
// 			carrierCode: 'ups',
// 			carrierNickname: 'ShipEngine Test Account - UPS',
// 			carrierFriendlyName: 'UPS',
// 			validationStatus: 'valid',
// 			warningMessages: [],
// 			errorMessages: [],
// 		};
// 		const { cart, cartDetails, shippingMethod } = req.session;
// 		const { id } = req.params;
// 		res.render('users/orderOverview', { id, cart, cartDetails, shippingMethod });
// 	}),
// );

//test routes for the tailwind update
// router.get('/:id/test', isLoggedIn, verifyUser, catchAsync(renderDashboardTw));
router.get('/:id/products', isLoggedIn, verifyUser, catchAsync(renderProductsTW));
router.get('/:id/:productId/edit', isLoggedIn, verifyUser, catchAsync(renderEditProductTW));

router.get('/:id/profile', isLoggedIn, verifyUser, catchAsync(renderProfile));
router.get('/:id/profile/editShipping', isLoggedIn, verifyUser, catchAsync(renderEditShipping));
router.post('/:id/profile/editShipping', isLoggedIn, verifyUser, catchAsync(saveShippingInfo));
router.post('/:id/');
router.get('/:id/orders', isLoggedIn, verifyUser, catchAsync(renderOrdersTW));

router.get('/:id/orders/newOrder', isLoggedIn, verifyUser, catchAsync(renderNewOrder));

router.get('/:id/orders/selectPayment', isLoggedIn, verifyUser, catchAsync(renderPaymentSelect));

router.get('/:id/orders/shippingInfo', isLoggedIn, verifyUser, catchAsync(renderShippingInfo));
router.post('/:id/orders/shippingInfo', isLoggedIn, verifyUser, catchAsync(calculateRates));
router.put('/:id/orders/shippingInfo', isLoggedIn, verifyUser, catchAsync(applyShipping));
router.get('/:id/orders/customerInfo', isLoggedIn, verifyUser, catchAsync(renderCustomerInfo));
router.post('/:id/orders/customerInfo', isLoggedIn, verifyUser, catchAsync(confirmCusomerInfo));
router.get('/:id/orders/overview', isLoggedIn, verifyUser, catchAsync(renderOverview));
router.post('/:id/orders/createOrder', isLoggedIn, verifyUser, catchAsync(finalizeOrder));
router.get(
	'/:id/orders/:orderId/confirmation',
	isLoggedIn,
	verifyUser,
	catchAsync(renderOrderConfirmation),
);
//renders the dashboard populated with user '/:id' information pulled from database
router.get('/:id/dashboard', isLoggedIn, verifyUser, catchAsync(renderDashboardTw));

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
	.get(isLoggedIn, verifyUser, catchAsync(renderNewProductTW))
	.post(isLoggedIn, verifyUser, catchAsync(createNewProduct));

router
	.route('/:id/:productId')
	.get(isLoggedIn, verifyUser, catchAsync(renderViewProduct))
	.post(isLoggedIn, verifyUser, catchAsync(modifyProduct))
	.delete(isLoggedIn, verifyUser, catchAsync(deleteProductMethod));

router.get('/:id/:productId/edit', isLoggedIn, verifyUser, catchAsync(renderNewProductTW));

module.exports = router;
