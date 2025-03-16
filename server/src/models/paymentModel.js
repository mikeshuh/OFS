const db = require('../config/db');

const Payment = {
  create: async (orderID, userID, paymentIntentID, amount) => {
    const query = `
      INSERT INTO payments (orderID, userID, paymentIntentID, amount, currency, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const currency = 'usd';
    const status = 'PENDING';

    const [result] = await db.execute(query, [
      orderID,
      userID,
      paymentIntentID,
      amount,
      currency,
      status
    ]);

    return result.insertId;
  },

  updateStatus: async (paymentID, status) => {
    const query = `UPDATE payments SET status = ? WHERE paymentID = ?`;
    await db.execute(query, [status, paymentID]);
  }
};

module.exports = Payment;
