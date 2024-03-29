const mongoose = require('mongoose');
const Product = require('../newModels/Product');
const { adjectives, types } = require('./names');

mongoose.connect('mongodb://localhost:27017/LMDM_Database', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const seedDB = async () => {
	await Product.deleteMany({});
	for (let i = 0; i < 20; i++) {
		const random5 = Math.floor(Math.random() * 5);
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const prod = new Product({
			store: '647fa760bcfbc22c4e0796ac',
			name: `${adjectives[random1000]} ${types[random5]}`,
			category: types[random5],
			description: 'example description of product',
			startingPrice: price,
			startingAlternate: 'large',
			stock: [{ alternate: 'large', quantity: 5, price }],
		});
		await prod.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
