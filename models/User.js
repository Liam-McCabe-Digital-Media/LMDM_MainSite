const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	status: {
		type: Boolean,
		required: false,
	},
	key: {
		type: String,
		required: false,
		unique: true,
	},
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
