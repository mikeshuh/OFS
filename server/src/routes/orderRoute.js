const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const validation = require('../utils/validationUtils');

// All Routes Are Protected
// POST /api/users/register - Register a new user
router.post('/create-order', protect, validation.validateOrder, orderController.createOrder);

//need to implement a authentication middleware that determines if the user has the corresponding id or if the user is an admin
router.get('/user/:userID', protect, admin, validation.validateParamInt('userID'), orderController.getOrderByUserID);

router.put('/update-status/:orderID', protect, admin, validation.validateParamInt('orderID'), orderController.updateOrderStatus)

router.delete('/cancel/:orderID', protect, admin, validation.validateParamInt('orderID'), orderController.deleteOrder);

//Admin Routes
router.get('/details/:orderID', protect, admin, validation.validateParamInt('orderID'), orderController.getOrderByOrderID);

module.exports = router;