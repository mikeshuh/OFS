// Authentication middleware
// Protects routes by verifying JWT tokens
const { verifyToken, extractTokenFromHeaders } = require('../utils/authUtils');
const User = require('../models/userModel');
const responseHandler = require('../utils/responseHandler');
const tokenService = require('../services/tokenService');

// Middleware to protect routes - requires valid JWT token
const protect = async (req, res, next) => {
  try {
    // Get token from authorization header
    const token = extractTokenFromHeaders(req.headers);

    // Check if token exists
    if (!token) {
      return responseHandler.unauthorized(res, 'Access denied. No token provided.');
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return responseHandler.unauthorized(res, 'Invalid token. Please log in again.');
    }

    // Check if token is blacklisted
    const isBlacklisted = await tokenService.isBlacklisted(token);
    if (isBlacklisted) {
      return responseHandler.unauthorized(res, 'Invalid or expired session. Please log in again.');
    }

    // Check if token version matches user's current version
    const currentTokenVersion = await User.getTokenVersion(decoded.id);
    if (decoded.tokenVersion !== currentTokenVersion) {
      return responseHandler.unauthorized(res, 'Your credentials have changed. Please log in again.');
    }

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return responseHandler.unauthorized(res, 'User not found. Please log in again.');
    }

    // Attach user to request object
    req.user = user;
    req.token = token;
    req.isAdmin = user.isAdmin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return responseHandler.error(res, 'Authentication failed.');
  }
};

// Middleware to restrict access to admin users only
const admin = (req, res, next) => {
  // protect middleware should run before this
  if (!req.user || !req.user.isAdmin) {
    return responseHandler.forbidden(res, 'Access denied. Admin privileges required.');
  }

  next();
};

module.exports = {
  protect,
  admin
};
