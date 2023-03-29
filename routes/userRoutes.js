const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login', keepSessionInfo: true, }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.post('/register', catchAsync(async (req, res, next) => {
    try{
        const {firstName, lastName, email, username, password} = req.body.user;
        const user = new User({firstName, lastName, email, username});
        const registeredUser = await User.register(user, password);
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