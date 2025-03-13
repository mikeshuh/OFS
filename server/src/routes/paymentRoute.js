const express = require("express");
const { createPaymentIntent } = require("../services/paymentService");

const router = express.Router();

/**
 * @route POST /api/payment/create-payment-intent
 * @desc Create a Stripe payment intent
 * @access Public
 */

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: "Amount and currency are required" });
    }

    const paymentIntent = await createPaymentIntent(amount, currency);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Payment Intent Error:", error.message);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

module.exports = router;

//有问题要改，然后适配paymentCountroller.js