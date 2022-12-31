require('dotenv').config();

const connectDB = require('./db/connect');
const Product = require('./models/products');

const jsonProducts = require('./db/product.json');

const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany();
        await Product.create(jsonProducts)
        console.log('Success');
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

start()