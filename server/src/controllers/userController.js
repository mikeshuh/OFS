// User controller
// Handles user-related operations like registration, login, and profile management
const User = require('../models/userModel');
const responseHandler = require('../utils/responseHandler');
const { generateToken, hashPassword, comparePassword } = require('../utils/authUtils');
const tokenService = require('../services/tokenService');

const COOKIE_NAME = 'token';
const COOKIE_OPTIONS = {
  httpOnly: true,                         // hide from JS
  secure:  process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000,            // 24h in ms (match your JWT expiry)
};

// Register a new user
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return responseHandler.badRequest(res, 'Email is already in use.');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user (non-admin by default)
    const userData = {
      isAdmin: false,
      firstName,
      lastName,
      email,
      hashedPassword
    };

    await User.create(userData);

    // Return success
    return responseHandler.created(res, undefined, 'User registered successfully.');
  } catch (error) {
    console.error(`Registration error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to register user.');
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return responseHandler.unauthorized(res, 'Invalid email or password.');
    }

    // Check if password matches
    const isPasswordValid = await comparePassword(password, user.hashedPassword);
    if (!isPasswordValid) {
      return responseHandler.unauthorized(res, 'Invalid email or password.');
    }

    // Get user without password
    const userData = await User.findById(user.userID);

    // Generate token
    const token = generateToken(userData);

    // Return success with token
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    return responseHandler.success(res, null, 'Login successful.');
  } catch (error) {
    console.error(`Login error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to login.');
  }
};

// User logout
const logout = async (req, res) => {
  try {
    // Blacklist the current token
    await tokenService.blacklistToken(req.token, req.user.userID);

    // expire the cookie
    res.cookie(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
    return responseHandler.success(res, null, 'Logged out successfully.');
  } catch (error) {
    console.error(`Logout error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to logout.');
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userID = req.user.userID;

    // Get user profile
    const user = await User.findById(userID);
    if (!user) {
      return responseHandler.notFound(res, 'User not found.');
    }

    return responseHandler.success(res, user, 'User profile retrieved successfully.');
  } catch (error) {
    console.error(`Get profile error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to retrieve user profile.');
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userID = req.user.userID;
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findByEmail(req.user.email);

    // Check if current password matches
    const isPasswordValid = await comparePassword(currentPassword, user.hashedPassword);
    if (!isPasswordValid) {
      return responseHandler.badRequest(res, 'Current password is incorrect.');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    const success = await User.updatePassword(userID, hashedPassword);
    if (!success) {
      return responseHandler.error(res, 'Failed to change password.');
    }

    // Increment token version to invalidate all existing tokens
    await User.incrementTokenVersion(userID);

    // Blacklist the current token for immediate effect
    if (req.token) {
      await tokenService.blacklistToken(req.token, userID);
    }

    res.cookie(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
    return responseHandler.success(res, null, 'Password changed successfully.');
  } catch (error) {
    console.error(`Change password error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to change password.');
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  changePassword
};
