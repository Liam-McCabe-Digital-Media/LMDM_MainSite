const User = require('../newModels/User');

module.exports.getUser = async (id) => {
	const user = await User.findById(id);
	return user;
};

module.exports.getShipmentObjects = async (user) => {
	await user.populate('address');
	let shipFrom = {
		name: `${user.firstName} ${user.lastName}`,
		phone: user.phone,
		addressLine1: user.address.street,
		addressLine2: user.address.streetTwo,
		cityLocality: user.address.city,
		stateProvince: user.address.state,
		postalCode: user.address.zipcode,
		countryCode: 'US',
		addressResidentialIndicator: 'yes',
	};
	return shipFrom;
};
