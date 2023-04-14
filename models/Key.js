const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
	key: {
		type: String,
		required: true,
		unique: true,
	},
	active: {
		type: Boolean,
		required: true,
		default: false,
	},
	user: {
		type: String,
		required: true,
	},
	signature: {
		type: {
			startDate: {
				type: String,
				required: true,
			},
			note: {
				type: String,
				required: false,
			},
		},
		required: false,
	},
});

const Key = mongoose.model('Key', keySchema);
module.exports = Key;
