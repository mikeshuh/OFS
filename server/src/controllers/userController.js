// User controller
// Handles user-related operations like registration, login, and profile management
const User = require('../models/userModel');
const responseHandler = require('../utils/responseHandler');
const { generateToken, hashPassword, comparePassword } = require('../utils/authUtils');
const validation = require('../utils/validationUtils');
const tokenService = require('../services/tokenService');

// Register a new user
const register = async (req, res) => {
  try {
    // Validate input
    const validationResult = validation.validateRegistration(req.body);
    if (!validationResult.isValid) {
      return responseHandler.badRequest(res, validationResult.errors[0], validationResult.errors);
    }

    const { firstName, lastName, email, password } = req.body;

    // Sanitize input
    const sanitizedEmail = validation.sanitizeEmail(email);

    // Check if user already exists
    const existingUser = await User.findByEmail(sanitizedEmail);
    if (existingUser) {
      return responseHandler.badRequest(res, 'User with this email already exists.');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user (non-admin by default)
    const userData = {
      isAdmin: false,
      firstName: validation.sanitizeString(firstName),
      lastName: validation.sanitizeString(lastName),
      email: sanitizedEmail,
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
    // Validate input
    const validationResult = validation.validateLogin(req.body);
    if (!validationResult.isValid) {
      return responseHandler.badRequest(res, validationResult.errors[0], validationResult.errors);
    }

    const { email, password } = req.body;

    // Sanitize email
    const sanitizedEmail = validation.sanitizeEmail(email);

    // Find user by email
    const user = await User.findByEmail(sanitizedEmail);
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
    return responseHandler.success(res, {token}, 'Login successful.');
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

    return responseHandler.success(res, null, 'Logged out successfully.');
  } catch (error) {
    console.error(`Logout error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to logout.');
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userID = validation.parseId(req.params.userID);

    // Check if requesting user is authorized to view this profile
    if (req.user.userID !== userID && !req.user.isAdmin) {
      return responseHandler.forbidden(res, 'You are not authorized to view this profile.');
    }

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

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userID = validation.parseId(req.params.userID);

    // Check if requesting user is authorized to update this profile
    if (req.user.userID !== userID && !req.user.isAdmin) {
      return responseHandler.forbidden(res, 'You are not authorized to update this profile.');
    }

    // Validate input
    const validationResult = validation.validateProfileUpdate(req.body);
    if (!validationResult.isValid) {
      return responseHandler.badRequest(res, validationResult.errors[0], validationResult.errors);
    }

    const { firstName, lastName, email } = req.body;

    // Sanitize inputs
    const sanitizedEmail = email ? validation.sanitizeEmail(email) : null;

    // If email is being updated, check if it's already in use
    if (sanitizedEmail) {
      const existingUser = await User.findByEmail(sanitizedEmail);
      if (existingUser && existingUser.userID !== userID) {
        return responseHandler.badRequest(res, 'Email is already in use.');
      }
    }

    // Update user
    const userData = {
      firstName: firstName ? validation.sanitizeString(firstName) : req.user.firstName,
      lastName: lastName ? validation.sanitizeString(lastName) : req.user.lastName,
      email: sanitizedEmail || req.user.email
    };

    const success = await User.update(userID, userData);
    if (!success) {
      return responseHandler.error(res, 'Failed to update user profile.');
    }

    // Get updated user
    const updatedUser = await User.findById(userID);

    return responseHandler.success(res, updatedUser, 'User profile updated successfully.');
  } catch (error) {
    console.error(`Update profile error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to update user profile.');
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userID = validation.parseId(req.params.userID);

    // Check if requesting user is authorized to change this password
    if (req.user.userID !== userID) {
      return responseHandler.forbidden(res, 'You are not authorized to change this password.');
    }

    // Validate input
    const validationResult = validation.validatePasswordChange(req.body);
    if (!validationResult.isValid) {
      return responseHandler.badRequest(res, validationResult.errors[0], validationResult.errors);
    }

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

    return responseHandler.success(res, null, 'Password changed successfully.');
  } catch (error) {
    console.error(`Change password error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to change password.');
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const userID = validation.parseId(req.params.userID);

    // Check if requesting user is authorized to delete this account
    if (req.user.userID !== userID && !req.user.isAdmin) {
      return responseHandler.forbidden(res, 'You are not authorized to delete this account.');
    }

    // Delete user
    const result = await User.delete(userID);
    if (!result || !result.success) {
      return responseHandler.error(res, 'Failed to delete user account.');
    }

    return responseHandler.success(
      res,
      { ordersDeleted: result.ordersDeleted },
      'User account deleted successfully.'
    );
  } catch (error) {
    console.error(`Delete account error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to delete user account.');
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
};
