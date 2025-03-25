const Order = require('../models/orderModel');
const responseHandler = require('../utils/responseHandler');

const createOrder = async (req, res) => {
  try{
    const {totalPrice, totalPounds, deliveryFee, orderStatus, streetAddress, city, zipCode} = req.body;
    const userID = req.userID;

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
const getOrderByUserID = async (req, res) =>{
  try {
    //find all orders associated with logged in users userID
    const userID = req.userID;
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


module.exports = {
  getOrderByUserID,
  createOrder
};