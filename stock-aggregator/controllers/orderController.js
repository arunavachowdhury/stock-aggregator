const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Product = require('../db/models/product');
const Order = require('../db/models/orders');
const OrderProduct = require('../db/models/orderproduct');
const sequelize = require('../db/connection');
const { publishToQueue } = require('../queues/rabbitmq');

const makeOrder = catchAsync(async (req, res, next) => {
    const payload = req.body.products;

    if (!Array.isArray(payload)) {
        throw new AppError('Expected items to be an array');
    }

    const totals = payload.reduce((acc, item) => {
        const qty = item.qty || 0;
        const price = item.price || 0;

        acc.totalQty += qty;
        acc.totalPrice += price;

        return acc;
    }, {
        totalQty: 0,
        totalPrice: 0
    });

    const totalQty = totals.totalQty;
    const totalPrice = totals.totalPrice;

    const t = await sequelize.transaction();

    try {
        let orderedProducts = new Array();
        // Lock and validate each product
        for (const item of payload) {
            const product = await Product.findOne({
                where: {
                    id: item.productId
                },
                lock: t.LOCK.UPDATE,
                transaction: t
            });

            if (!product) throw new AppError(`Product ${item.productId} not found`);

            orderedProducts.push({
                vendorProductId: product.vendorProductId,
                productId: product.id,
                qty: item.qty
            });

            const availableStock = product.actualStock - product.reservedStock
            if (availableStock < item.qty)
                throw new AppError(`Insufficient stock for product ${item.productId}`);

            // Reserve stock
            product.reservedStock += item.qty;
            await product.save({
                transaction: t
            });
        }

        // Create order summary
        const order = await Order.create({
            userName: 'Arunava',
            orderQty: totalQty,
            orderPrice: totalPrice
        }, {
            transaction: t
        });

        // Insert order products
        for (const item of payload) {
            await OrderProduct.create({
                orderId: order.id,
                productId: item.productId,
                qty: item.qty,
                price: item.price
            }, {
                transaction: t
            });
        }

        await t.commit();

        // Publish to RabbitMQ for processing
        await publishToQueue('order.created', {
            orderId: order.id,
            orderedProducts
        });

        return res.status(200).json({
            success: true,
            order_id: order.id
        });

    } catch (err) {
        await t.rollback();
        throw new AppError(`Error. Please try again. ${err.message}`);
    }
});

module.exports = { makeOrder };