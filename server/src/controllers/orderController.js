const Order = require('../models/orderModel');
const OrderProduct = require('../models/orderProductModel');
const responseHandler = require('../utils/responseHandler');
const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
  try{
    const {streetAddress, city, zipCode, orderProducts} = req.body
    const userID = req.user.userID;
    const orderStatus = 0; // 0 pending 1 delivered

    const { totalPrice, totalPounds, deliveryFee } = await orderService.calculateTotalPrice(orderProducts);

    //create the order
    const orderData = {
      userID: userID,
      totalPrice: totalPrice,
      totalPounds: totalPounds,
      deliveryFee: deliveryFee,
      orderStatus: orderStatus,
      streetAddress: streetAddress,
      city: city,
      zipCode: zipCode
    }

    //create the order
    const orderID = await Order.create(orderData);

    if (!orderID) {
      return responseHandler.error(res, 'Error creating order entry');
    }

    // create OrderProducts
    const orderProductSuccess = await OrderProduct.addProductsToOrder(orderID, orderProducts);

    if(!orderProductSuccess){
      await Order.delete(orderID); // Rollback order creation if OrderProduct creation fails
      console.error('Error creating orderProduct entries, rolling back order creation.');
      return responseHandler.error(res, 'Error creating orderProduct entry');
    }

    return responseHandler.created(res, {orderID}, 'Order created succesfully');
  } catch (error) {
    console.error(`Create order error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to create order.');
  }
}

const getOrderByUserID = async (req, res) =>{
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
 const getOrderDetailsByOrderID = async (req, res) =>{
  try {
    //find order by orderId to see if user should be able to access the order
    const orderID = req.params.orderID;
    const order = await Order.findById(orderID);
    const userID = req.user.userID;

    if (!order) {
      return responseHandler.notFound(res, 'Order not found.');
    }

    if(order.userID != userID) {
      return responseHandler.badRequest(res, 'Order not associated with account');
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
  getOrderDetailsByOrderID
};
