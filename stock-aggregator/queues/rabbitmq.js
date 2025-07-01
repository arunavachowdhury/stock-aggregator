const amqp = require('amqplib');
const sequelize = require('../db/connection');
const Product = require('../db/models/product');
const Order = require('../db/models/orders');
const OrderProduct = require('../db/models/orderproduct');
const AppError = require('../utils/appError');

let channel;

const QUEUE = 'order.created';

const connectRabbitMQ = async () => {
  const conn = await amqp.connect('amqp://localhost');
  channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  console.log('RabbitMQ connected');
};

const publishToQueue = async (queue, message) => {
  if (!channel) throw new AppError('RabbitMQ channel not initialized');
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
};

const consumeOrders = async () => {
  if (!channel) throw new AppError('RabbitMQ channel not initialized');
  await channel.consume(QUEUE, async (msg) => {
    if (msg !== null) {
      const {orderId, orderedProducts} = JSON.parse(msg.content.toString());
      console.log('Processing order:', orderId);
      const t = await sequelize.transaction();
      try {
        for (const productDetail of orderedProducts) {
            const vendorResponse = await fetch('http://localhost:3001/api/vendorA/item-stock-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: productDetail.vendorProductId,
                    qty: productDetail.qty
                })
            });

            const updated = await vendorResponse.json();
            
            console.log('Vendor Stock update response', updated);

            const product = await Product.findOne({
                where: { id: productDetail.productId },
                lock: t.LOCK.UPDATE,
                transaction: t
            });

            if (!product) throw new AppError(`Product ${productDetail.productId} not found during processing`);

            product.actualStock -= productDetail.qty;
            product.reservedStock -= productDetail.qty;
            await product.save({ transaction: t });
        }

        await t.commit();
        channel.ack(msg);
        console.log(`Order ${orderId} processed successfully`);

      } catch (e) {
        await t.rollback();
        console.error(`Failed to process order ${orderId}:`, e.message);
        channel.nack(msg, false, true);
      }
    }
  });
};

module.exports = { connectRabbitMQ, publishToQueue, consumeOrders };

