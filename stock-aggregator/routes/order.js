const express = require('express');

const router = express.Router();
const { makeOrder } = require('../controllers/orderController');

router.post('/place-order', makeOrder);

module.exports = router;