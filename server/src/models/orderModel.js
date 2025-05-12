// Import the database connection pool
const db = require('../config/db');
const Product = require('./productModel'); // Import the Product model

// Order model with database operations
const Order = {
  // Create a new order
  create: async (orderData, orderProducts) => {
    const {
      userID,
      totalPrice,
      totalPounds,
      deliveryFee,
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
        'INSERT INTO `Order` (userID, totalPrice, totalPounds, deliveryFee, streetAddress, city, zipCode) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userID, totalPrice, totalPounds, deliveryFee, streetAddress, city, zipCode]
      );

      const orderID = result.insertId;

      // Always lock in a consistent order
      orderProducts.sort((a, b) => a.productID - b.productID);

      // Check if all products have sufficient inventory
      for (const orderProduct of orderProducts) {
        const [inventoryResult] = await connection.execute(
          'SELECT quantity FROM Product WHERE productID = ? FOR UPDATE',
          [orderProduct.productID]
        );

        if (!inventoryResult[0] || inventoryResult[0].quantity < orderProduct.cartQuantity) {
          const { name } = await Product.findById(orderProduct.productID);
          throw new Error(`Insufficient inventory for ${name}. Requested: ${orderProduct.cartQuantity}, Available: ${inventoryResult[0]?.quantity || 0}`);
        }
      }
      for (const orderProduct of orderProducts) {
        // Insert each product into the OrderProduct table
        await connection.execute(
          'INSERT INTO OrderProduct (orderID, productID, quantity) VALUES (?, ?, ?)',
          [orderID, orderProduct.productID, orderProduct.cartQuantity]
        );
      }
      await connection.commit();
      return orderID; // Return the ID of the newly created order
    } catch (error) {
      await connection.rollback();  // Rollback transaction on error
      throw new Error(`Failed to create order: ${error.message}`);
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
      `SELECT o.*,
              op.quantity AS orderQuantity,
              p.productID, p.category, p.name, p.price, p.pounds, p.imagePath
       FROM \`Order\` o
       JOIN OrderProduct op ON o.orderID = op.orderID
       JOIN Product p ON op.productID = p.productID
       WHERE o.orderID = ?`,
      [orderID]
    );
    return rows;
  },
  completeOrder: async (orderID) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // First, check if the order is already completed (prevent duplicate processing)
      const [orderStatus] = await connection.execute(
        'SELECT paymentStatus FROM `Order` WHERE orderID = ? FOR UPDATE',
        [orderID]
      );
      
      if (!orderStatus[0]) {
        throw new Error(`Order ${orderID} not found`);
      }
      
      if (orderStatus[0].paymentStatus === 'paid') {
        // Order already processed - no need to update inventory again
        await connection.commit();
        connection.release();
        return true;
      }
      
      // Get products in the order
      const [orderProducts] = await connection.execute(
        `SELECT op.productID, op.quantity AS cartQuantity
        FROM OrderProduct op
        JOIN \`Order\` o ON op.orderID = o.orderID
        WHERE o.orderID = ?`,
        [orderID]
      );
      
      if (orderProducts.length === 0) {
        throw new Error(`No products found in order ${orderID}`);
      }
      
      // Check current inventory before updating (with locks)
      for (const orderProduct of orderProducts) {
        const [inventoryResult] = await connection.execute(
          'SELECT quantity FROM Product WHERE productID = ? FOR UPDATE',
          [orderProduct.productID]
        );
        
        if (!inventoryResult[0] || inventoryResult[0].quantity < orderProduct.cartQuantity) {
          throw new Error(`Insufficient inventory for product ${orderProduct.productID}. Requested: ${orderProduct.cartQuantity}, Available: ${inventoryResult[0]?.quantity || 0}`);
        }
      }
      
      // All checks passed, now update products inventory
      let affectedRows = 0;
      for (const orderProduct of orderProducts) {
        const [updateResult] = await connection.execute(
          'UPDATE Product SET quantity = quantity - ? WHERE productID = ? AND quantity >= ?',
          [orderProduct.cartQuantity, orderProduct.productID, orderProduct.cartQuantity]
        );
        
        if (updateResult.affectedRows === 0) {
          throw new Error(`Failed to update inventory for product ${orderProduct.productID}`);
        }
        
        affectedRows += updateResult.affectedRows;
      }
      
      if (affectedRows === 0) {
        throw new Error('No inventory was updated');
      }
      
      await connection.commit(); // Commit transaction
      return true;
    } catch (error) {
      await connection.rollback(); // Rollback transaction on error
      throw error;
    }
    finally {
      connection.release(); // Release the connection back to the pool
    }
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
  },

  updateQueuedForDelivery: async (orderID, queuedForDelivery) => {
    const [result] = await db.execute(
      'UPDATE `Order` SET queuedForDelivery = ? WHERE orderID = ?',
      [queuedForDelivery, orderID]
    );
    return result.affectedRows > 0; // Return true if update was successful
  },

  findUnqueuedPaidOrders: async () => {
    const [rows] = await db.execute(
      `SELECT * FROM \`Order\`
      WHERE paymentStatus = 'paid'
        AND queuedForDelivery = FALSE
        AND orderStatus = FALSE
      ORDER BY orderTime ASC`
    );
    return rows; // Return all unqueued paid orders
  }
};

module.exports = Order;
