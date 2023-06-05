const User = require('../newModels/User');

module.exports.getUser = async (id) => {
	const user = await User.findById(id);
	return user;
};
