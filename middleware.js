// const {getUser} = require('./database/Accounts');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'you must be logged in');
		return res.redirect('/users/login');
	}
	next();
};

module.exports.verifyUser = (req, res, next) => {
	const {id} = req.params;
	if(!id == req.user._id.toString()){
		req.flash('error', 'User verification failed');
		return res.redirect('/users/login');
	}
	next();
}