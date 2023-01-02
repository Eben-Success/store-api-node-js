const Product = require('../models/products');

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({price: {$gt:30}})
    .sort('price')
    .select('name price')
    .limit(10)
    .skip(2)
    res.status(200).json({ products, nbHits: products.length })
}



const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }

    if (company) {
        queryObject.company = company
    }

    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }

    if (numericFilters){
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$e',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters
        .replace(regEx, (match)=> `-${operatorMap[match]}-`)

        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item)=> {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        })
    }


    console.log(queryObject);
    let result = Product.find(queryObject)
    // sort
    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }

    // select fields
    if (fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }

    // set page limit or 1 if user doesn't pass the value
    const page = Number(req.body.page) || 1

    // set limit, if no limit, limit == 10
    const limit = Number(req.body.limit) || 10

    // skip 
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}


