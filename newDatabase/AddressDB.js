const Address = require('../newModels/Address');

module.exports.getAddress = async (addressId) => {
	const address = await Address.findById(addressId);
	return address;
};

module.exports.createAddress = async (address) => {
	const newAddress = await Address.create(address);
	return newAddress;
};
