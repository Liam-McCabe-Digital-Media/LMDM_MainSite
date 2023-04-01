const express = require('express');
const router = express.Router();
const cmsRoutes = require('./cmsRoutes');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');

const {switchDB, getDBModel} = require('../database/index');

const UserSchemas = new Map([['User', User.schema]])

router.use('/', cmsRoutes);

//renders login page
router.get('/login', (req, res) => {
    res.render('authenticate/login');
});

//renders register page
router.get('/register', (req, res) => {
    res.render('authenticate/register');
});

//logs in the user and sets currentUser to logged in user
//req.session.returnTo is the link clicked before logging in
//returns to that link after login
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login', keepSessionInfo: true, }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

//registers a user and adds their information to UserInformation database
//does not yet create a product database for user
router.post('/register', catchAsync(async (req, res, next) => {
    try{
        const userDB = await switchDB('UserInformation', UserSchemas);
        const userModel = await getDBModel(userDB, 'User');
        const {firstName, lastName, email, username, password} = req.body.user;
        const user = new userModel({firstName, lastName, email, username});
        const registeredUser = await userModel.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'LMDM');
            res.redirect('/');
        })
        
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/users/register');
    }
}));

//logs out the user from the session
router.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) {
			throw new ExpressError(err.message, 500);
		} else {
			req.flash('success', 'Goodbye');
			res.redirect('/');
		}
	});
});

module.exports = router;