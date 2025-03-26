const { enabled } = require('../../app');
const { stripeClient } = require('../config/stripe');

const createPaymentIntent = async (orderID, amount) => {
  return await stripeClient.paymentIntents.create({
    amount: Math.round(amount),
    currency: "usd",
    metadata: { orderID },
    automatic_payment_methods:{
      enabled: true,
      allow_redirects: 'never'
    }
  });
};

module.exports = { createPaymentIntent };
