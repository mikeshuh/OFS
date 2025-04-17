const Order = require('../models/orderModel');
const responseHandler = require('../utils/responseHandler');
const orderService = require('../services/orderService');

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

    return responseHandler.created(res, { orderID }, 'Order created succesfully');
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

const updateOrderDetails = async (req, res) => {
  try {
    const orderID = req.params.orderID;
    const userID = req.user.userID;
    const {orderProducts} = req.body;

    // Check if the order exists and belongs to the user
    const order = await Order.findById(orderID);
    if (!order) {
      return responseHandler.notFound(res, 'Order not found.');
    }
    if (order.userID !== userID) {
      return responseHandler.forbidden(res, 'You do not have permission to update this order.');
    }

    // Validate the order products
    const { totalPrice, totalPounds, deliveryFee } = await orderService.calculateTotalPrice(orderProducts);
    if (totalPounds > 50) {
      return responseHandler.badRequest(res, 'Total pounds exceed the maximum limit of 50 lbs.');
    }

    const orderData = {
      userID,
      totalPrice,
      totalPounds,
      deliveryFee,
      orderID
    }

    // Update the order details
    const response = await Order.updateOrderDetails(orderData, orderProducts);
    return responseHandler.success(res, response, 'Order updated successfully.');
  } catch (error) {
    console.error(`Update order error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to update order.');
  }
}

const updateOrderAddress = async (req, res) => {
  try {
    const deliveryAddress = req.body;
    const orderID = req.params.orderID;
    const userID = req.user.userID;

    // Check if the order exists and belongs to the user
    const order = await Order.findById(orderID);
    if (!order) {
      return responseHandler.notFound(res, 'Order not found.');
    }
    if (order.userID !== userID) {
      return responseHandler.forbidden(res, 'You do not have permission to update this order.');
    }

    // Update the order address
    await Order.updateOrderAddress(orderID, deliveryAddress);

    return responseHandler.success(res, null, 'Order address updated successfully.');
  } catch (error) {
    console.error(`Update order address error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to update order address.');
  }
}


module.exports = {
  getOrderByUserID,
  createOrder,
  getOrderDetailsByOrderID,
  updateOrderAddress,
  updateOrderDetails,
};
