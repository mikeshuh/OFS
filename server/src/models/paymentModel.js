// Import the database connection pool
const db = require('../config/db');

// Payment model with database operations
const Payment = {
  // Create a new payment record
  create: async (paymentData) => {
    const {
      orderID,
      amount,
      paymentType,
      stripePaymentIntentID,
      cardLastFour,
      cardBrand,
      status
    } = paymentData;

    const [result] = await db.execute(
      'INSERT INTO Payment (orderID, amount, paymentType, stripePaymentIntentID, cardLastFour, cardBrand, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [orderID, amount, paymentType, stripePaymentIntentID, cardLastFour, cardBrand, status]
    );

    return result.insertId; // Return the ID of the newly created payment
  },

  // Find a payment by Stripe payment intent ID
  findByPaymentIntentID: async (stripePaymentIntentID) => {
    const [rows] = await db.execute(
      'SELECT * FROM Payment WHERE stripePaymentIntentID = ?',
      [stripePaymentIntentID]
    );
    return rows[0]; // Return the payment or undefined
  },

  // Find all payments for an order
  findByOrderID: async (orderID) => {
    const [rows] = await db.execute(
      'SELECT * FROM Payment WHERE orderID = ? ORDER BY createdAt DESC',
      [orderID]
    );
    return rows;
  },

  // Update payment status
  updateStatus: async (paymentID, status) => {
    const [result] = await db.execute(
      'UPDATE Payment SET status = ? WHERE paymentID = ?',
      [status, paymentID]
    );
    return result.affectedRows > 0; // Return true if update was successful
  },

  // Create a refund record
  createRefund: async (paymentData) => {
    // Set paymentType to 'refund'
    paymentData.paymentType = 'refund';
    return await Payment.create(paymentData);
  }
};

module.exports = Payment;
