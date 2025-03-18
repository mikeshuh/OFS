const db = require('../config/db');

const Payment = {
  create: async (orderID, userID, paymentIntentID, totalPrice, paymentStatus) => {
    const query = `
      INSERT INTO Payment (orderID, userID, paymentIntentID, totalPrice, paymentStatus)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      orderID,
      userID,
      paymentIntentID,
      totalPrice,
      paymentStatus
    ]);

    return result.insertId;
  },

  updateStatusByIntentID: async (paymentIntentID, newStatus) => {
    const query = `UPDATE Payment SET paymentStatus = ? WHERE paymentIntentID = ?`;
    await db.execute(query, [newStatus, paymentIntentID]);
  }
};

module.exports = Payment;
