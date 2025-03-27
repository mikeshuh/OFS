const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { processPayment, handleStripeWebhook } = require('../controllers/paymentController');

// User initiates payment
router.post('/', protect, processPayment);

// Stripe Webhook
router.post('/webhook', handleStripeWebhook);

module.exports = router;
