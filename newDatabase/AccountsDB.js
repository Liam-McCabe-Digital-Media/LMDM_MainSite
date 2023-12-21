const User = require('../newModels/User');
const { updateAddress, createAddress, deleteAddress } = require('./AddressDB');

module.exports.getUser = async (id) => {
	const user = await User.findById(id);
	return user;
};

module.exports.getUserByUsername = async (username) => {
	const user = await User.findOne({ username });
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

module.exports.updateUser = async (id, newUser) => {
	const user = await this.getUser(id);
	await user.populate('address');
	await deleteAddress(user.address._id);
	console.log('newUser:' + newUser);
	const { firstName, lastName, phone, email } = newUser;
	user.firstName = firstName;
	user.lastName = lastName;
	user.phone = phone;
	user.email = email;
	user.address = null;
	await user.save();
	return user;
};

module.exports.updateUserWithAddress = async (id, newUser, newAddress) => {
	const user = await this.getUser(id);
	const { firstName, lastName, phone, email } = newUser;
	user.firstName = firstName;
	user.lastName = lastName;
	user.phone = phone;
	user.email = email;
	if (user.address) {
		await updateAddress(user.address._id, newAddress);
	} else {
		let newAddressObj = await createAddress(newAddress);
		user.address = newAddressObj._id;
	}
	await user.save();
	return user;
};
