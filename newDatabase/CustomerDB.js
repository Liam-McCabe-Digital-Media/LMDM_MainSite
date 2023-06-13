const Customer = require('../newModels/Customer');
const { createAddress } = require('./AddressDB');

module.exports.createCustomer = async (customer, address) => {
	const newCustomer = await Customer.create(customer);
	const newAddress = await createAddress(address);
	newCustomer.address = newAddress._id;
	await newCustomer.save();
	return newCustomer;
};

module.exports.createCustomer = async (customer) => {
	const newCustomer = await Customer.create(customer);
	return newCustomer;
};
