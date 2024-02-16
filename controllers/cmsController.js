const { getUser, updateUser, updateUserWithAddress } = require('../newDatabase/AccountsDB');
const { createProduct, deleteProduct, updateProduct } = require('../newDatabase/ProductDB');
module.exports.deleteProductMethod = async (req, res) => {
	const { id, productId } = req.params;
	deleteProduct(productId);
	res.redirect(`/users/${id}/products`);
};

module.exports.modifyProduct = async (req, res) => {
	const { id, productId } = req.params;
	let updated = req.body;
	updated.store = id;
	const product = await updateProduct(productId, updated);
	res.redirect(`/users/${id}/${productId}`);
};

module.exports.createNewProduct = async (req, res) => {
	const product = req.body;
	product.store = req.user._id;
	const newProduct = await createProduct(req.user._id, product);
	const { id } = req.params;
	req.flash('success', 'New Product Created');
	res.redirect(`/users/${id}/dashboard`);
};

module.exports.saveProfileInfo = async (req, res) => {
	const user = await getUser(req.params.id);
	const newUser = req.body.newUser;
	const addressPresent = req.body.addressPresent;
	if (typeof req.body.address !== typeof undefined && addressPresent == 1) {
		const newAddress = req.body.address;
		await updateUserWithAddress(user._id, newUser, newAddress);
	} else {
		await updateUser(user._id, newUser);
	}
	res.redirect(`/users/${user._id}/profile`);
};
