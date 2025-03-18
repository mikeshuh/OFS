const Stripe = require("stripe");
require("dotenv").config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_SECRET_KEY;

const stripeClient = Stripe(stripeSecretKey);

module.exports = { stripeClient };
