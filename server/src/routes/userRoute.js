// User routes
// Defines API endpoints for user operations
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const paymentRoutes = require("./paymentRoute");

// Public routes (no authentication required)
// POST /api/users/register - Register a new user
router.post('/register', userController.register);

// POST /api/users/login - Authenticate user and return JWT token
router.post('/login', userController.login);

// Protected routes (authentication required)
// POST /api/users/logout - Blacklist current token
router.post('/logout', protect, userController.logout);

// GET /api/users/profile/:userID - Get user profile details
router.get('/profile/:userID', protect, userController.getProfile);

// PUT /api/users/profile/:userID - Update user profile
router.put('/profile/:userID', protect, userController.updateProfile);

// PUT /api/users/change-password/:userID - Change user password
router.put('/change-password/:userID', protect, userController.changePassword);

// DELETE /api/users/delete/:userID - Delete user account
router.delete('/delete/:userID', protect, userController.deleteAccount);

// Admin routes

module.exports = router;
