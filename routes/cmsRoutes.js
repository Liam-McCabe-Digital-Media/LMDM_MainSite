const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const {isLoggedIn, verifyUser} = require('../middleware');
const {getUser} = require('../database/AccountsDB');
const {getAllProducts} = require('../database/UserDB');

//renders the dashboard populated with user '/:id' information pulled from database
router.get('/:id/dashboard', isLoggedIn, verifyUser, catchAsync(async (req, res) => {
    const user = await getUser(req.params.id);
    const products = await getAllProducts(user.username);
    res.render('users/dashboard', {user, products});
}));

router.get('/:id/new', isLoggedIn, verifyUser, catchAsync(async (req, res) => {
    res.render('users/newProduct');
}));



module.exports = router;