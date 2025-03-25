const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { validateOrder } = require('../utils/validationUtils');

// All Routes Are Protected
// POST /api/users/register - Register a new user
router.post('/create-order', protect, validateOrder, orderController.createOrder);

router.get('/user', protect, orderController.getOrderByUserID);

module.exports = router;