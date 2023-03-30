const mongoose = require('mongoose');
const Product = require('../models/Product');

class userDatabaseConnection {
    constructor(user){
        this.user = user;
        this.userDb = mongoose.createConnection(`mongodb://localhost:27017/${user.key}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        this.userDb.on('error', console.error.bind(console, 'connection error:'));
        this.userDb.once('open', () => {
            console.log('database connected');
        });

        this.productModel = userDb.model(Product);
    }

    getAllProducts = async () => {
        const productList = await productModel.find();
        return productList;
    }
}