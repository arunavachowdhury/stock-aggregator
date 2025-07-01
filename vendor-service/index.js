const express = require('express');

const app = express()
require('dotenv').config();

const mongoose = require('mongoose');
const { getProducts, getProductById, reduceProductStock } = require('./controllers/productController');

const db_path = process.env.DB_PATH;
const PORT = process.env.PORT ?? 3000;

// Connect to MongoDB
mongoose.connect(`${db_path}`)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error', err));


app.get('/', (req, res) => {
    res.send('Hello from Express');
});

app.use(express.json());

app.get('/api/vendorA/items', getProducts);
app.get('/api/vendorA/item/:id', getProductById);
app.post('/api/vendorA/item-stock-update', reduceProductStock);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});