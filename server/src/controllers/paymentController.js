const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const validation = require('../utils/validationUtils');
const responseHandler = require('../utils/responseHandler');
const { calculateTotalAmount } = require('../utils/paymentUtils');
const { createPaymentIntent } = require('../services/paymentService');

const processPayment = async (req, res) => {
  try {
    // Step 1: Validate input
    const validationResult = validation.validatePaymentInput(req.body);
    if (!validationResult.isValid) {
      return responseHandler.badRequest(res, validationResult.errors[0], validationResult.errors);
    }

    // Step 2: Sanitize input
    const sanitizedOrderID = validation.sanitizeInteger(req.body.orderID);

    // Step 3: Retrieve order
    const order = await Order.getById(sanitizedOrderID);
    if (!order) {
      return responseHandler.notFound(res, 'Order not found.');
    }

    // Step 4: Calculate total amount (includes tax, in cents)
    const amount = calculateTotalAmount(order);

    // Step 5: Create Stripe PaymentIntent
    const paymentIntent = await createPaymentIntent(sanitizedOrderID, amount);

    // Step 6: Record payment in DB
    await Payment.create(sanitizedOrderID, req.user.userID, paymentIntent.id, amount);

    // Step 7: Respond with clientSecret
    return responseHandler.success(res, { clientSecret: paymentIntent.client_secret }, 'Payment intent created successfully');
  } catch (error) {
    console.error(`Error processing payment: ${error.message}`, error);
    return responseHandler.error(res, `Error processing payment : ${error.message}`);
  }
};

module.exports = { processPayment };
