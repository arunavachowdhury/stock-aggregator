const express = require('express');
require('dotenv').config();
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');
const { connectRabbitMQ, consumeOrders } = require('./queues/rabbitmq')

const app = express();

app.use(express.json());
app.use('/products', productRouter);
app.use('/order', orderRouter);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

const connectServer = (async() => {
    await connectRabbitMQ();
    await consumeOrders();
    app.listen(PORT, () => {
        console.log('Server is listening on port '+PORT);
    });
})();

