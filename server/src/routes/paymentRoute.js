const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { validatePaymentIntent } = require('../utils/validationUtils');

// Get Stripe publishable key
router.get('/config', protect, paymentController.getPublishableKey);

// Webhook endpoint (no authentication, called by Stripe)
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
