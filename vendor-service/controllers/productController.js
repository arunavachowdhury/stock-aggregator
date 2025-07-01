const express = require('express');

const Product = require('../models/product');

const getProducts = async(req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({data: products, count: products.length});
    } catch (error) {
        return res.status(500).json({msg: error.message});
    }
}

const getProductById = async(req, res) => {
    try {
        const productId = req.params.id;
        const productDetails = await Product.findById(productId);

        return res.status(200).json({data: productDetails});
    } catch (error) {
        return res.status(500).json({msg: error.message});
    }
}

const reduceProductStock = async(req, res) => {
    try {
        const { productId, qty } = req.body;

        await Product.updateOne({ _id: productId }, { $inc: { actualStock: -qty } })
                    .orFail(() => Error('Not found'));

        return res.status(200).json({msg: 'Updated'});
    } catch (error) {
        return res.status(500).json({msg: error.message});
    }
}

module.exports = {
    getProducts,
    getProductById,
    reduceProductStock
}