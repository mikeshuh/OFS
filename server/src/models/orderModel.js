// Import the database connection pool
const db = require('../config/db');

// Order model with database operations
const Order = {
  create: async (orderData) => {
    const {
      userID,
      totalPrice,
      totalPounds,
      deliveryFee,
      orderStatus,
      streetAddress,
      city,
      zipCode
    } = orderData;

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        'INSERT INTO `Order` (userID, totalPrice, totalPounds, deliveryFee, orderStatus, streetAddress, city, zipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userID, totalPrice, totalPounds, deliveryFee, orderStatus, streetAddress, city, zipCode]
      );

      const orderID = result.insertId;

      await connection.commit();
      return orderID;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Find an order by ID
  findById: async (orderID) => {
    const [rows] = await db.execute(
      'SELECT * FROM `Order` WHERE orderID = ?',
      [orderID]
    );
    return rows[0];
  },

  // Find all orders for a specific user
  findByUser: async (userID) => {
    const [rows] = await db.execute(
      'SELECT * FROM `Order` WHERE userID = ? ORDER BY orderTime DESC',
      [userID]
    );
    return rows;
  },

  updateStatus: async (orderID, orderStatus) => {
    const [result] = await db.execute(
      'UPDATE `Order` SET orderStatus = ? WHERE orderID = ?',
      [orderStatus, orderID]
    );
    return result.affectedRows > 0;
  },

  delete: async (orderID) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      await connection.execute(
        'DELETE FROM OrderProduct WHERE orderID = ?',
        [orderID]
      );

      const [result] = await connection.execute(
        'DELETE FROM `Order` WHERE orderID = ?',
        [orderID]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get order details with joined product information
  findOrderDetails: async (orderID) => {
    const [rows] = await db.execute(
      `SELECT o.*, op.quantity, p.*
       FROM \`Order\` o
       JOIN OrderProduct op ON o.orderID = op.orderID
       JOIN Product p ON op.productID = p.productID
       WHERE o.orderID = ?`,
      [orderID]
    );
    return rows;
  },

  getTotalWeight: async (orderID) => {
    const query = `
      SELECT SUM(p.pounds * op.quantity) AS totalWeight
      FROM OrderProduct op
      JOIN Product p ON op.productID = p.productID
      WHERE op.orderID = ?
    `;
    const [rows] = await db.execute(query, [orderID]);
    return rows[0].totalWeight || 0;
  },

  updateDeliveryInfo: async (orderID, deliveryFee, productsPrice) => {
    const query = `UPDATE \`Order\` SET deliveryFee = ?, productsPrice = ? WHERE orderID = ?`;
    await db.execute(query, [deliveryFee, productsPrice, orderID]);
  }
};

module.exports = Order;
