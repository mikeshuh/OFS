const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { validateOrder, validateParamInt } = require('../utils/validationUtils');

//Creates an order that is associated with the user that is logged in.
router.post('/create-order', protect, validateOrder, orderController.createOrder);

//Updates the delivery address of the order
router.put('/update-address/:orderID', protect, validateParamInt('orderID'), orderController.updateOrderAddress);

//Gets the orders associated with the user that is logged in.
router.get('/user', protect, orderController.getOrderByUserID);

//Updates the order details of the order.
router.put('/update-order/:orderID', protect, validateParamInt('orderID'), orderController.updateOrderDetails);

//Gets the order and associated order-products given an orderID and the userID matches the userID on the order
router.get('/details/:orderID', protect, validateParamInt('orderID'), orderController.getOrderDetailsByOrderID);

module.exports = router;
