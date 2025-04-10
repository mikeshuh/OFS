// Import the database connection pool
const db = require('../config/db');

// Product model with database operations
const Product = {
  // find all products
  findAll: async () => {
    const [rows] = await db.execute('SELECT * FROM Product');
    return rows;
  },

  findBySearch: async (searchTerm) => {
    const search = `%${searchTerm}%`; // Add the wildcard for partial matching
    const [rows] = await db.execute(
      'SELECT * FROM Product WHERE name LIKE ? OR category LIKE ?',
      [search, search]
    );
    return rows;
  },
  

  // find products by category
  findByCategory: async (category) => {
    const [rows] = await db.execute(
      'SELECT * FROM Product WHERE category = ?',
      [category]
    );
    return rows;
  },

  // find a product by ID
  findById: async (productID) => {
    const [rows] = await db.execute(
      'SELECT * FROM Product WHERE productID = ?',
      [productID]
    );
    return rows[0]; // Return the product object or undefined
  },

  // Create a new product
  create: async (productData) => {
    const { category, name, price, pounds, quantity,imageBinary } = productData;

    const [result] = await db.execute(
      'INSERT INTO Product (category, name, price, pounds, quantity,imageBinary) VALUES (?, ?, ?, ?, ?, ?)',
      [category, name, price, pounds, quantity, imageBinary]
    );

    return result.insertId; // Return the ID of the newly created product
  },

  // Update a product
  update: async (productID, productData) => {
    const { category, name, price, pounds, quantity, imageBinary } = productData;

    const [result] = await db.execute(
      'UPDATE Product SET category = ?, name = ?, price = ?, pounds = ?, quantity = ?, imageBinary = ? WHERE productID = ?',
      [category, name, price, pounds, quantity, imageBinary, productID]
    );

    return result.affectedRows > 0; // Return true if update was successful
  },

  // Delete a product
  delete: async (productID) => {
    // First, check if the product is referenced in any orders
    const [orderProducts] = await db.execute(
      'SELECT COUNT(*) as count FROM OrderProduct WHERE productID = ?',
      [productID]
    );

    if (orderProducts[0].count > 0) {
      // Product is referenced in orders, cannot delete
      throw new Error('Cannot delete product as it exists in orders');
    }

    // Safe to delete the product
    const [result] = await db.execute(
      'DELETE FROM Product WHERE productID = ?',
      [productID]
    );

    return result.affectedRows > 0; // Return true if deletion was successful
  },

  // Update product quantity (for inventory management)
  updateQuantity: async (productID, quantityChange) => {
    const [result] = await db.execute(
      'UPDATE Product SET quantity = quantity + ? WHERE productID = ?',
      [quantityChange, productID]
    );

    return result.affectedRows > 0; // Return true if update was successful
  }
};

module.exports = Product;
