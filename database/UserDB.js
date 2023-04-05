const {switchDB, getDBModel} = require('../database/index');
const Product = require('../models/Product');
const ProductSchemas = new Map([['Product', Product.schema]]);

module.exports.getAllProducts = async (username) => {
    const dbName = `LMDM_${username}`;
    const productDB = await switchDB(dbName, ProductSchemas);
    const productModel = await getDBModel(productDB, 'Product');
    const product = await productModel.find();
    return product;
}