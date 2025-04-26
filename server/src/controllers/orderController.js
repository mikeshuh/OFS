const Order = require('../models/orderModel');
const responseHandler = require('../utils/responseHandler');
const orderService = require('../services/orderService');
const paymentController = require('./paymentController');
const createOrder = async (req, res) => {
  try {
    const { streetAddress, city, zipCode, orderProducts } = req.body
    const userID = req.user.userID;

    const { totalPrice, totalPounds, deliveryFee } = await orderService.calculateTotalPrice(orderProducts);

    if (totalPounds > 50) {
      return responseHandler.badRequest(res, 'Total pounds exceed the maximum limit of 50 lbs.');
    }

    //create the order
    const orderData = {
      userID,
      totalPrice,
      totalPounds,
      deliveryFee,
      streetAddress,
      city,
      zipCode
    }

    const orderID = await Order.create(orderData, orderProducts);
    req.body.orderID = orderID;
    const clientSecret = await paymentController.createPaymentIntent(req,res);
    if (!clientSecret) {
      throw new Error('Failed to create payment intent');
    }

    return responseHandler.created(res, { orderID,clientSecret }, 'Order created succesfully');
  } catch (error) {
    console.error(`Create order error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to create order.');
  }
}

const getOrderByUserID = async (req, res) => {
  try {
    //find all orders associated with logged in users userID
    const userID = req.user.userID;
    const order = await Order.findByUser(userID);

    if (!order) {
      return responseHandler.notFound(res, 'Order not found.');
    }
    return responseHandler.success(res, order, 'Order retrieved succesfully');
  } catch (error) {
    console.error(`Get order error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to retrieve order.');
  }
}

// get single order, route: /api/order/:orderId
const getOrderDetailsByOrderID = async (req, res) => {
  try {
    //find order by orderId to see if user should be able to access the order
    const orderID = req.params.orderID;
    const order = await Order.findById(orderID);
    const userID = req.user.userID;

    if (!order) {
      return responseHandler.notFound(res, 'Order not found.');
    }

    if (order.userID != userID) {
      return responseHandler.forbidden(res, 'Order not associated with account');
    }

    //if the user is associated with the order return the associated order products
    const orderDetails = await Order.findOrderDetails(orderID);
    if (!orderDetails) {
      return responseHandler.notFound(res, 'order details not found.');
    }
    return responseHandler.success(res, orderDetails, 'Order retrieved succesfully');
  } catch (error) {
    console.error(`Get order error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to retrieve order.');
  }
}

module.exports = {
  getOrderByUserID,
  createOrder,
  getOrderDetailsByOrderID,
};
