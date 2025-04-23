// Import the database connection pool
const db = require('../config/db');

// User model with database operations
const User = {
  // Create a new user in the database
  create: async (userData) => {
    const { isAdmin, firstName, lastName, email, hashedPassword } = userData;

    const [result] = await db.execute(
      'INSERT INTO User (isAdmin, firstName, lastName, email, hashedPassword) VALUES (?, ?, ?, ?, ?)',
      [isAdmin, firstName, lastName, email, hashedPassword]
    );

    return result.insertId; // Return the ID of the newly created user
  },

  // Find a user by email (used for login)
  findByEmail: async (email) => {
    const [rows] = await db.execute(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );

    return rows[0]; // Return the user object or undefined
  },

  // Find a user by ID
  findById: async (userID) => {
    const [rows] = await db.execute(
      'SELECT userID, isAdmin, firstName, lastName, email, tokenVersion FROM User WHERE userID = ?',
      [userID]
    );

    return rows[0]; // Return the user object without password
  },

  // Update user password
  updatePassword: async (userID, hashedPassword) => {
    const [result] = await db.execute(
      'UPDATE User SET hashedPassword = ? WHERE userID = ?',
      [hashedPassword, userID]
    );

    return result.affectedRows > 0; // Return true if update was successful
  },

  // Get user's current token version
  getTokenVersion: async (userID) => {
    const [rows] = await db.execute(
      'SELECT tokenVersion FROM User WHERE userID = ?',
      [userID]
    );
    return rows[0] ? rows[0].tokenVersion : null;
  },

  // Increment user's token version
  incrementTokenVersion: async (userID) => {
    const [result] = await db.execute(
      'UPDATE User SET tokenVersion = tokenVersion + 1 WHERE userID = ?',
      [userID]
    );
    return result.affectedRows > 0;
  }
};

module.exports = User;
