const stripe = require('../config/stripe');
const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const responseHandler = require('../utils/responseHandler');
const deliveryQueueService = require('../services/deliveryQueueService');

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
    return paymentIntent.client_secret;

  } catch (error) {
    console.error('Payment intent error:', error);
    throw error;
    // responseHandler.error(res, 'Error creating payment intent');
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
    let paymentDetails = await getPaymentDetailsFromPaymentIntent(paymentIntent.id);

    // Extract card details if available
    let cardLastFour = null;
    let cardBrand = null;

    if (paymentDetails?.payment_method?.type === 'card') {
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

    // First try to update inventory with proper locking
    try {
      // Try to update inventory with proper locking
      await Order.completeOrder(orderID);
      
      // Only if inventory update succeeds, update payment status
      await Order.updatePaymentStatus(orderID, 'paid');
      
      // If successful, add to delivery queue
      const orderDetails = await Order.findById(orderID);
      console.log("Retrieved order details:", orderDetails);

      if (orderDetails) {
        deliveryQueueService.addOrderToQueue(orderDetails);
      } else {
        console.error(`Order with ID ${orderID} not found for delivery queue.`);
      }
    } catch (error) {
      console.error(`Inventory error fulfilling order ${orderID}:`, error.message);
      
      // If we can't fulfill due to inventory, issue a refund and mark order as failed
      try {
        await stripe.refunds.create({
          payment_intent: paymentIntent.id,
          reason: 'requested_by_customer'
        });
        
        // Update order status to indicate failure
        await Order.updatePaymentStatus(orderID, 'failed');
        
        console.log(`Refund issued for order ${orderID} due to inventory shortage: ${error.message}`);
      } catch (refundError) {
        console.error(`Failed to issue refund for order ${orderID}:`, refundError);
      }
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

// Handler for failed payments
const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    const orderID = paymentIntent.metadata.orderID;

    // Get payment details from the Stripe API to access payment method details
    let paymentDetails = await getPaymentDetailsFromPaymentIntent(paymentIntent.id);

    // Extract card details if available
    let cardLastFour = null;
    let cardBrand = null;

    if (paymentDetails?.payment_method?.type === 'card') {
      cardLastFour = paymentDetails.payment_method.card.last4;
      cardBrand = paymentDetails.payment_method.card.brand;
    }

    // Find the payment record in our database
    const payment = await Payment.findByPaymentIntentID(paymentIntent.id);

    if (payment) {
      // Update payment record
      await Payment.updateStatus(payment.paymentID, 'failed');

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

    // Extract card details if available
    let cardLastFour = null;
    let cardBrand = null;

    if (charge.payment_method_details?.type === 'card') {
      cardLastFour = charge.payment_method_details.card.last4;
      cardBrand = charge.payment_method_details.card.brand;
    }

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
          cardLastFour,
          cardBrand,
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

// Get card details from payment intent
const getPaymentDetailsFromPaymentIntent = async (paymentIntentID) => {
  try {
    let paymentDetails = await stripe.paymentIntents.retrieve(paymentIntentID, {
      expand: ['payment_method']
    });
    return paymentDetails;
  } catch (error) {
    console.error('Error retrieving card details from Stripe:', error);
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
