const Product = require('../models/products');

const getAllProductsStatic = async (req, res) =>{
    const products = await Product.find({name: 'vase table'})
    res.status(200).json({ products, nbHits: products.length })
}



const getAllProducts = async (req, res) =>{
    res.status(200).json({msg: 'product route'})
}

module.exports = {
    getAllProducts, 
    getAllProductsStatic,
}