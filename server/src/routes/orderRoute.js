const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { validateOrder } = require('../utils/validationUtils');

//Creates an order that is associated with the user that is logged in.
router.post('/create-order', protect, validateOrder, orderController.createOrder);

//Gets the orders associated with the user that is logged in.
router.get('/user', protect, orderController.getOrderByUserID);

module.exports = router;