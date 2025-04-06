// Import the database connection pool
const db = require('../config/db');

// Order model with database operations
const Order = {
  // Create a new order
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

    // Begin a transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert the order into the database
      const [result] = await connection.execute(
        'INSERT INTO `Order` (userID, totalPrice, totalPounds, deliveryFee, orderStatus, streetAddress, city, zipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userID, totalPrice, totalPounds, deliveryFee, orderStatus, streetAddress, city, zipCode]
      );

      const orderID = result.insertId;

      await connection.commit();
      return orderID; // Return the ID of the newly created order
    } catch (error) {
      await connection.rollback();  // Rollback transaction on error
      return null;
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  },

  // Find an order by ID
  findById: async (orderID) => {
    const [rows] = await db.execute(
      'SELECT * FROM `Order` WHERE orderID = ?',
      [orderID]
    );
    return rows[0]; // Return the order object or undefined
  },

  // Find all orders for a specific user
  findByUser: async (userID) => {
    const [rows] = await db.execute(
      'SELECT * FROM `Order` WHERE userID = ? ORDER BY orderTime DESC',
      [userID]
    );
    return rows;
  },

  // Update order status
  updateStatus: async (orderID, orderStatus) => {
    const [result] = await db.execute(
      'UPDATE `Order` SET orderStatus = ? WHERE orderID = ?',
      [orderStatus, orderID]
    );
    return result.affectedRows > 0; // Return true if update was successful
  },

  // Delete an order
  delete: async (orderID) => {
    // Begin a transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Delete related order products first (cascade should handle this, but being explicit)
      await connection.execute(
        'DELETE FROM OrderProduct WHERE orderID = ?',
        [orderID]
      );

      // Delete the order
      const [result] = await connection.execute(
        'DELETE FROM `Order` WHERE orderID = ?',
        [orderID]
      );

      await connection.commit();
      return result.affectedRows > 0; // Return true if deletion was successful
    } catch (error) {
      await connection.rollback(); // Rollback transaction on error
      throw error;
    } finally {
      connection.release(); // Release the connection back to the pool
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

  // Update payment status
  updatePaymentStatus: async (orderID, paymentStatus) => {
    const [result] = await db.execute(
      'UPDATE `Order` SET paymentStatus = ? WHERE orderID = ?',
      [paymentStatus, orderID]
    );
    return result.affectedRows > 0; // Return true if update was successful
  },

  // Get order with payment information
  findOrderWithPayment: async (orderID) => {
    const [rows] = await db.execute(
      `SELECT o.*, p.stripePaymentIntentID, p.status AS paymentDetailStatus,
              p.cardLastFour, p.cardBrand, p.createdAt AS paymentCreatedAt
      FROM \`Order\` o
      LEFT JOIN Payment p ON o.orderID = p.orderID AND p.paymentType = 'payment'
      WHERE o.orderID = ?
      ORDER BY p.createdAt DESC
      LIMIT 1`,
      [orderID]
    );
    return rows[0]; // Return the order with payment info
  }
};

module.exports = Order;
