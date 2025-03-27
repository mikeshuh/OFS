const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const validation = require('../utils/validationUtils');
const responseHandler = require('../utils/responseHandler');
const { calculateTotalAmount } = require('../utils/paymentUtils');
const { createPaymentIntent } = require('../services/paymentService');
const stripeClient = require('../config/stripe').stripeClient;
const stripeWebhookSecret = require('../config/stripe').webhookSecret;

const processPayment = async (req, res) => {
  try {
    const validationResult = validation.validatePaymentInput(req.body);
    if (!validationResult.isValid) {
      return responseHandler.badRequest(res, validationResult.errors[0], validationResult.errors);
    }

    const sanitizedOrderID = validation.sanitizeInteger(req.body.orderID);

    const order = await Order.getById(sanitizedOrderID);
    if (!order) {
      return responseHandler.notFound(res, 'Order not found.');
    }

    const totalWeight = await Order.getTotalWeight(sanitizedOrderID);

    let deliveryFee = 0;
    if (totalWeight > 20) {
      deliveryFee = 10; // $10 delivery fee
    }

    order.deliveryFee = deliveryFee;
    order.totalPrice = order.productsPrice + deliveryFee;
    // Update only deliveryFee & productsPrice in Order
    await Order.updateDeliveryInfo(
      sanitizedOrderID,
      deliveryFee,
      order.productsPrice,
      order.totalPrice
    );

    const amount = calculateTotalAmount(order); // returns amount in cents
    const paymentIntent = await createPaymentIntent(
      sanitizedOrderID,
      amount
    );

    const paymentStatus = 'Pending';

    console.log('Create Payment Parameters:', {
      orderID: sanitizedOrderID,
      userID: req.user.userID,
      paymentIntentID: paymentIntent.id,
      totalPrice: order.totalPrice,
      paymentStatus
    });

    await Payment.create(
      sanitizedOrderID,
      req.user.userID,
      paymentIntent.id,
      order.totalPrice,
      paymentStatus
    );

    return responseHandler.success(res, { clientSecret: paymentIntent.client_secret }, 'Payment intent created successfully');
  } catch (error) {
    console.error(`Error processing payment: ${error.message}`, error);
    return responseHandler.error(res, `Error processing payment : ${error.message}`);
  }
};

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    console.log("Webhook received, verifying signature...");

    event = stripeClient.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
    console.log("Webhook verified:", event.id, event.type);

    if (event.type === 'payment_intent.succeeded') {
      console.log("Payment Succeeded Event Handling Start");
      const paymentIntent = event.data.object;
      await Payment.updateStatusByIntentID(paymentIntent.id, 'Paid');
      console.log(`Database updated for PaymentIntent ${paymentIntent.id}`);
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      await Payment.updateStatusByIntentID(paymentIntent.id, 'Failed');
      console.log(`Database updated for PaymentIntent ${paymentIntent.id} to status Failed`);
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    // Must always respond:
    res.json({ received: true });
  } catch (err) {
    console.error(`Webhook signature verification failed or DB error:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = { processPayment, handleStripeWebhook };
