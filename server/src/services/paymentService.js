const Stripe = require("stripe");
const env = require("../config/env");  // Use env.js to load environment variables

const stripe = Stripe(env.stripeSecretKey); // load STRIPE_SECRET_KEY

/**
 * Create a Stripe Payment Intent
 * @param {number} amount - Payment amount (in smallest currency unit, e.g., cents)
 * @param {string} currency - Currency code (e.g., "usd")
 * @returns {Promise<Object>} - Returns Stripe Payment Intent
 */
const createPaymentIntent = async (amount, currency) => {
  try {
    return await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"], // only support credit card payments
    });
  } catch (error) {
    console.error("Stripe Payment Error:", error.message);
    throw error;
  }
};

module.exports = { createPaymentIntent };
