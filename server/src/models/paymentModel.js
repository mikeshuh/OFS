const db = require('../config/db');

const Payment = {
  create: async (orderID, userID, paymentIntentID, amount) => {
    const query = `INSERT INTO Payments (orderID, userID, paymentIntentID, amount, status) VALUES (?, ?, ?, ?, 'PENDING')`;
    const [result] = await db.execute(query, [orderID, userID, paymentIntentID, amount]);
    return result.insertId;
  },

  updateStatus: async (paymentID, status) => {
    const query = `UPDATE Payments SET status = ? WHERE id = ?`;
    await db.execute(query, [status, paymentID]);
  }
};

module.exports = Payment;
