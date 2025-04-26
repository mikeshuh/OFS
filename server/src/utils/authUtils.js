// Utility for authentication functions
// Provides functions for JWT token generation and password hashing
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const env = require('../config/env');

// Generate a JWT token for authenticated users
const generateToken = (user, expiresIn = '24h') => {
  // Create payload with essential user information (excluding sensitive data)
  const payload = {
    id: user.userID,
    email: user.email,
    isAdmin: user.isAdmin,
    tokenVersion: user.tokenVersion || 0
  };

  // Generate and return the token
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (error) {
    return null; // Return null if token is invalid
  }
};

// Hash a password using bcrypt
const hashPassword = async (password, saltRounds = 10) => {
  return await bcrypt.hash(password, saltRounds);
};

// Compare a password with a hashed password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword
};
