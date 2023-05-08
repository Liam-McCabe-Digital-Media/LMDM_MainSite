const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const {
	renderLogin,
	renderRegister,
	loginUser,
	logoutUser,
	registerUser,
} = require('../controllers/userController');

//renders login page
router.get('/login', renderLogin);

//renders register page
router.get('/register', renderRegister);

//logs in the user and sets currentUser to logged in user
//req.session.returnTo is the link clicked before logging in
//returns to that link after login
router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/users/login',
		keepSessionInfo: true,
	}),
	loginUser,
);

//registers a user and adds their information to UserInformation database
//does not yet create a product database for user
router.post('/register', catchAsync(registerUser));

//logs out the user from the session
router.get('/logout', logoutUser);

module.exports = router;
