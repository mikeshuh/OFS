const deliveryQueue = require('./deliveryQueue');
const Order = require('../models/orderModel');

deliveryQueue.process(async (job) => {
  const { orderID } = job.data;
  try {
    await Order.updateStatus(orderID, true);
    console.log(`Order ${orderID} marked as delivered.`);
    return Promise.resolve();
  } catch (error) {
    console.error(`Error processing order ${orderID}:`, error);
    throw error;
  }
});
