const User = require('../newModels/User');
const { generateAPIKey } = require('../newDatabase/KeysDB');

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
		const { firstName, lastName, phone, email, username, password } = req.body.user;
		const user = new User({ firstName, lastName, phone, email, username });
		const registeredUser = await User.register(user, password);
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
