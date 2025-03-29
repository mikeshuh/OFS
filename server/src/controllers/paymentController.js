const stripe = require('../config/stripe');
const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const responseHandler = require('../utils/responseHandler');

// Create a payment intent when checkout is initiated
const createPaymentIntent = async (req, res) => {
  try {
    const { orderID } = req.body;

    // Check if user is authorized to pay for this order
    const order = await Order.findById(orderID);
    if (!order) {
      return responseHandler.notFound(res, 'Order not found');
    }

    // Only the order owner or an admin can pay for it
    if (order.userID !== req.user.userID && !req.user.isAdmin) {
      return responseHandler.forbidden(res, 'You are not authorized to pay for this order');
    }

    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return responseHandler.badRequest(res, 'Order is already paid');
    }

    // Calculate amount in cents (Stripe requires amounts in smallest currency unit)
    const amount = Math.round(order.totalPrice * 100);

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        orderID: orderID.toString(),
        userID: order.userID.toString()
      }
    });

    // Create an initial payment record with pending status
    await Payment.create({
      orderID,
      amount: order.totalPrice,
      stripePaymentIntentID: paymentIntent.id,
      status: 'pending'
    });

    // Return client secret to frontend
    responseHandler.created(res, {
      clientSecret: paymentIntent.client_secret
    }, 'Payment intent created successfully');

  } catch (error) {
    console.error('Payment intent error:', error);
    responseHandler.error(res, 'Error creating payment intent');
  }
};

// Handle Stripe webhook events
const handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object);
      break;

    case 'charge.refunded':
      await handleChargeRefunded(event.data.object);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return success response to Stripe
  res.status(200).json({ received: true });
};

// Handler for successful payments
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    const orderID = paymentIntent.metadata.orderID;

    // Get payment details from the Stripe API to access payment method details
    let paymentDetails;
    try {
      paymentDetails = await stripe.paymentIntents.retrieve(paymentIntent.id, {
        expand: ['payment_method']
      });
    } catch (error) {
      console.error('Error retrieving payment details from Stripe:', error);
    }

    // Extract card details if available
    let cardLastFour = null;
    let cardBrand = null;

    if (paymentDetails && paymentDetails.payment_method && paymentDetails.payment_method.card) {
      cardLastFour = paymentDetails.payment_method.card.last4;
      cardBrand = paymentDetails.payment_method.card.brand;
    }

    // Find the payment record in our database
    const payment = await Payment.findByPaymentIntentID(paymentIntent.id);

    if (payment) {
      // Update payment record
      await Payment.updateStatus(payment.paymentID, 'completed');

      // Update card details if they were provided by Stripe
      if (cardLastFour && cardBrand) {
        await Payment.updateCardDetails(payment.paymentID, cardLastFour, cardBrand);
      }
    } else {
      // Create a new payment record if it doesn't exist
      await Payment.create({
        orderID,
        amount: paymentIntent.amount / 100, // Convert cents to dollars
        stripePaymentIntentID: paymentIntent.id,
        cardLastFour,
        cardBrand,
        status: 'completed'
      });
    }

    // Update order payment status
    await Order.updatePaymentStatus(orderID, 'paid');

    // Additional actions to trigger after successful payment:
    // - Send confirmation email
    // - Update inventory
    // - Trigger delivery process

  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

// Handler for failed payments
const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    const orderID = paymentIntent.metadata.orderID;

    // Find the payment record in our database
    const payment = await Payment.findByPaymentIntentID(paymentIntent.id);

    if (payment) {
      // Update payment record
      await Payment.updateStatus(payment.paymentID, 'failed');
    } else {
      // Create a new payment record if it doesn't exist
      await Payment.create({
        orderID,
        amount: paymentIntent.amount / 100, // Convert cents to dollars
        stripePaymentIntentID: paymentIntent.id,
        status: 'failed'
      });
    }

    // Update order payment status
    await Order.updatePaymentStatus(orderID, 'failed');

  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
};

// Handler for refunded charges
const handleChargeRefunded = async (charge) => {
  try {
    // Get the payment intent ID from the charge
    const paymentIntentID = charge.payment_intent;

    // Find the original payment
    const originalPayment = await Payment.findByPaymentIntentID(paymentIntentID);

    if (originalPayment) {
      // Check if we already processed this refund
      const existingRefund = await Payment.findByPaymentIntentID(charge.id);

      if (!existingRefund) {
        // Calculate refund amount
        const refundAmount = charge.amount_refunded / 100;

        // Create a refund record
        await Payment.createRefund({
          orderID: originalPayment.orderID,
          amount: refundAmount,
          stripePaymentIntentID: charge.id,
          status: 'completed'
        });

        // If this was a full refund, update order status
        if (charge.refunded) {
          await Order.updatePaymentStatus(originalPayment.orderID, 'refunded');
        }
      } else {
        console.log(`Refund for charge ${charge.id} already processed, skipping`);
      }
    }

  } catch (error) {
    console.error('Error handling refund:', error);
  }
};

// Get Stripe publishable key
const getPublishableKey = (req, res) => {
  responseHandler.success(res, {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
};

module.exports = {
  createPaymentIntent,
  handleWebhook,
  getPublishableKey
};
