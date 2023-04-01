const User = require('./models/User');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'you must be logged in');
		return res.redirect('/users/login');
	}
	next();
};