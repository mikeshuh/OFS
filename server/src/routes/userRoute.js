// User routes
// Defines API endpoints for user operations
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validateParamInt, validateRegistration, validateLogin, validatePasswordChange } = require('../utils/validationUtils');

// Public routes (no authentication required)
// POST /api/users/register - Register a new user
router.post('/register', validateRegistration, userController.register);

// POST /api/users/login - Authenticate user and return JWT token
router.post('/login', validateLogin, userController.login);

// Protected routes (authentication required)
// POST /api/users/logout - Blacklist current token
router.post('/logout', protect, userController.logout);

// GET /api/users/profile/:userID - Get user profile details
router.get('/profile', protect, userController.getProfile);

// PUT /api/users/change-password/:userID - Change user password
router.put('/change-password', protect, validatePasswordChange, userController.changePassword);

module.exports = router;
