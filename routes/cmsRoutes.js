const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const {isLoggedIn} = require('../middleware');
const {getAllProducts} = require('../database/UserDB');

//renders the dashboard populated with user '/:id' information pulled from database
router.get('/:id/dashboard', isLoggedIn, catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    const products = await getAllProducts(user.username);
    res.render('users/dashboard', {user, products});
}));



module.exports = router;