const { stripeClient } = require('../config/stripe');

const createPaymentIntent = async (orderID, amount) => {
  return await stripeClient.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    metadata: { orderID }
  });
};

module.exports = { createPaymentIntent };
