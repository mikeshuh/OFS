const Order = require('../models/orderModel');
const responseHandler = require('../utils/responseHandler');

const createOrder = async (req, res) => {
  try{
    const {userID, totalPrice, totalPounds, deliveryFee, orderStatus, streetAddress, city, zipCode} = req.body;
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

    const orderID = await Order.create(orderData);
    if(!orderID){
      return responseHandler.error(res, 'Error creating order');
    }
    return responseHandler.created(res, { orderID}, 'Order created succesfully');

  } catch (error) {
    console.error(`Create order error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to create order.');
  }
}

// get single product, route: /api/order/details/:orderId
const getOrderByOrderID = async (req, res) =>{
  try {
    //find order by orderId
    const orderID = req.params.orderID;
    const order = await Order.findById(orderID);

    if (!order) {
      return responseHandler.notFound(res, 'Order not found.');
    }
    return responseHandler.success(res, order, 'Order retrieved succesfully');
} catch (error) {
    console.error(`Get order error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to retrieve order.');
  }
}

// get single product, route: /api/order/details/:orderId
const getOrderByUserID = async (req, res) =>{
  try {
    //find order by userID
    const userID = req.params.userID;
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

// Update Order Status, route: /api/order/update-status/:orderID
const updateOrderStatus = async (req, res) =>{
  try {
      //update order status
      const orderID = req.params.orderID;
      const { orderStatus } = req.body;
      console.log("order Status:", orderStatus)

     const updatedOrder = Order.updateStatus(orderID, orderStatus);
     if(!updatedOrder){
      return responseHandler.error(res, 'Order update unsuccesful');
     }
     return responseHandler.success(res, 'Order update succesful');

  } catch (error) {
    console.error(`Get order error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to retrieve order.');
  }
}

// Delete an order, route: /api/order/cancel/:orderID
const deleteOrder = async (req, res) =>{
  try{
    //delete an order
    const orderID = req.params.orderID;
    const deleteOrder = Order.delete(orderID);

    if(!deleteOrder){
      return responseHandler.error(res, 'Order deletion unsucessful');
    }
    return responseHandler.success(res, 'Order deletion succesful');

  } catch (error) {
    console.error(`Get order error: ${error.message}`, error);
    return responseHandler.error(res, 'Failed to retrieve order.');
  }
}

module.exports = {
  getOrderByOrderID,
  getOrderByUserID,
  createOrder,
  updateOrderStatus,
  deleteOrder
};