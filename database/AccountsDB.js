const mongoose = require('mongoose');
const {switchDB, getDBModel} = require('./index');
const User = require('../models/User');
const UserSchemas = new Map([['User', User.schema]]);

module.exports.getUser = async (id) => {
    const userDB = await switchDB('UserInformation', UserSchemas);
    const userModel = await getDBModel(userDB, 'User');
    const user = await userModel.findById(id);
    return user;
}