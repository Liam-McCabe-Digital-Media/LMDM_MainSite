const User = require('../models/User');
const { generateAPIKey } = require('../database/KeysDB');
const { switchDB, getDBModel } = require('../database/index');

const UserSchemas = new Map([['User', User.schema]]);

module.exports.renderLogin = (req, res) => {
	res.render('authenticate/login');
};

module.exports.renderRegister = (req, res) => {
	res.render('authenticate/register');
};

module.exports.loginUser = (req, res) => {
	req.flash('success', 'welcome back!');
	const redirectUrl = req.session.returnTo || '/';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.registerUser = async (req, res, next) => {
	try {
		const userDB = await switchDB('UserInformation', UserSchemas);
		const userModel = await getDBModel(userDB, 'User');
		const { firstName, lastName, email, username, password } = req.body.user;
		const user = new userModel({ firstName, lastName, email, username });
		const registeredUser = await userModel.register(user, password);
		const apiKey = await generateAPIKey(registeredUser);
		registeredUser.key = apiKey;
		await registeredUser.save();
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash('success', 'LMDM');
			res.redirect('/');
		});
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/users/register');
	}
};

module.exports.logoutUser = (req, res) => {
	req.logout((err) => {
		if (err) {
			throw new ExpressError(err.message, 500);
		} else {
			req.flash('success', 'Goodbye');
			res.redirect('/');
		}
	});
};
