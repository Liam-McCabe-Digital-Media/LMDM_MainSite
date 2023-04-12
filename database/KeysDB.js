const {switchDB, getDBModel} = require('../database/index');
const Key = require('../models/Key');
const KeySchemas = new Map([['Key', Key.schema]]);
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports.generateAPIKey = async (user) => {
    const dbName = `APIKeys`;
    const keyDB = await switchDB(dbName, KeySchemas);
    const keyModel = await getDBModel(keyDB, 'Key');
    const uuidString = uuidv4();
    const apiString = `${user.username}${uuidString}`;
    const apiHash = await bcrypt.hash(apiString, 12);
    const doubleHash = await bcrypt.hash(apiHash, 12);
    const key = new keyModel({key: doubleHash, user: user.username});
    await key.save();
    return apiHash;
}

module.exports.verifyKey = async (req, res, next) => {
    const keyDB = await switchDB('APIKeys', KeySchemas);
    const keyModel = await getDBModel(keyDB, 'Key');
    const keyObject = await keyModel.findOne({user: req.query.store});
    const approval = await bcrypt.compare(req.query.key, keyObject.key);
    if(!approval){
        req.flash('error', 'api keys do not match');
        console.log('denied');
        return res.send('error');
    }
    next();
}
