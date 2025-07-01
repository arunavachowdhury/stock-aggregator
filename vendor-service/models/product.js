const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    actualStock: {
        type: Number,
        required: true
    },
    reservedStock: {
        type: Number
    },
    price: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    },
    company: {
        type: String
    }
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;