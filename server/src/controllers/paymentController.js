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
      order.productsPrice
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
    event = stripeClient.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log(`Payment succeeded for PaymentIntent: ${paymentIntent.id}`);
      await Payment.updateStatusByIntentID(paymentIntent.id, 'Paid');
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      console.log(`Payment failed for PaymentIntent: ${paymentIntent.id}`);
      await Payment.updateStatusByIntentID(paymentIntent.id, 'Failed');
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (dbError) {
    console.error(`Database update failed for PaymentIntent ${event.data.object.id}`, dbError);
    return res.status(500).send('Database update failed');
  }

  res.json({ received: true });
};

module.exports = { processPayment, handleStripeWebhook };
