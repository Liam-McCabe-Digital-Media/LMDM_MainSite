const Key = require('../newModels/Key');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports.generateAPIKey = async (user) => {
	const uuidString = uuidv4();
	const apiString = `${user.username}${uuidString}`;
	const apiHash = await bcrypt.hash(apiString, 12);
	const doubleHash = await bcrypt.hash(apiHash, 12);
	const key = new Key({ key: doubleHash, user: user.username });
	await key.save();
	return apiHash;
};

module.exports.postVerifyKey = async (req, res, next) => {
	console.log('verify');
	const keyObject = await Key.findOne({ user: req.body.store });
	const approval = await bcrypt.compare(req.body.key, keyObject.key);
	if (!approval) {
		req.flash('error', 'api keys do not match');
		console.log('denied');
		return res.send('error');
	}
	console.log('confirm');
	next();
};

module.exports.verifyKey = async (req, res, next) => {
	const keyObject = await Key.findOne({ user: req.query.store });
	const approval = await bcrypt.compare(req.query.key, keyObject.key);
	if (!approval) {
		req.flash('error', 'api keys do not match');
		console.log('denied');
		return res.send('error');
	}
	next();
};
