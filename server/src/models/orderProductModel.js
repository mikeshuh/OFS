// Import the database connection pool
const db = require('../config/db');

// OrderProduct model (junction table between Order and Product)
const OrderProduct = {
  // Add products to an order
  addProductToOrder: async (orderID, productID, quantity) => {
    // Begin a transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert the product into the OrderProduct table
      const [result] = await connection.execute(
        'INSERT INTO OrderProduct (orderID, productID, quantity) VALUES (?, ?, ?)',
        [orderID, productID, quantity]
      );

      // Update product inventory (decrease available quantity)
      await connection.execute(
        'UPDATE Product SET quantity = quantity - ? WHERE productID = ?',
        [quantity, productID]
      );

      await connection.commit();
      return result.insertId; // Return the ID of the newly created order-product relation
    } catch (error) {
      await connection.rollback(); // Rollback transaction on error
      throw error;
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  },

  // Add multiple products to an order in a single transaction
  addProductsToOrder: async (orderID, products) => {
    // Begin a transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert each product into the OrderProduct table
      for (const product of products) {
        await connection.execute(
          'INSERT INTO OrderProduct (orderID, productID, quantity) VALUES (?, ?, ?)',
          [orderID, product.productID, product.quantity]
        );

        // Update product inventory (decrease available quantity)
        await connection.execute(
          'UPDATE Product SET quantity = quantity - ? WHERE productID = ?',
          [product.quantity, product.productID]
        );
      }

      await connection.commit();
      return true; // Return true if all operations were successful
    } catch (error) {
      await connection.rollback(); // Rollback transaction on error
      throw error;
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  },

  // Get all products in an order
  getByOrderId: async (orderID) => {
    const [rows] = await db.execute(
      `SELECT op.*, p.name, p.price, p.pounds, p.category
       FROM OrderProduct op
       JOIN Product p ON op.productID = p.productID
       WHERE op.orderID = ?`,
      [orderID]
    );

    return rows;
  },

  // Remove a product from an order
  removeProductFromOrder: async (orderProductID) => {
    // Get the current order product details to restore inventory
    const [orderProduct] = await db.execute(
      'SELECT * FROM OrderProduct WHERE orderProductID = ?',
      [orderProductID]
    );

    if (!orderProduct[0]) {
      throw new Error('Order product not found');
    }

    // Begin a transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Delete the order product
      await connection.execute(
        'DELETE FROM OrderProduct WHERE orderProductID = ?',
        [orderProductID]
      );

      // Update product inventory (restore quantity)
      await connection.execute(
        'UPDATE Product SET quantity = quantity + ? WHERE productID = ?',
        [orderProduct[0].quantity, orderProduct[0].productID]
      );

      await connection.commit();
      return true; // Return true if deletion was successful
    } catch (error) {
      await connection.rollback(); // Rollback transaction on error
      throw error;
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  }
};

module.exports = OrderProduct;
