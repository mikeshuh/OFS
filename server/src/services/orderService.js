const Product = require('../models/productModel');

const orderService = {
  calculateTotalPrice: async (orderProducts) => {
    let totalPrice = 0;
    let totalPounds = 0;
    let deliveryFee = 0;
    const deliveryFeeAmount = 10; // hardcoded delivery fee amount

    //calculate total pounds and total price
    for (const orderProduct of orderProducts) {
      const productDetails = await Product.findById(orderProduct.productID);
      if (!productDetails) {
        return responseHandler.error(res, `Product with ID ${orderProduct.productID} not found.`);
      }
      totalPrice += productDetails.price * orderProduct.cartQuantity;
      totalPounds += productDetails.pounds * orderProduct.cartQuantity;
    }

    //determine if there is a delivery fee
    if (totalPounds >= 20){
      deliveryFee = 1;
      totalPrice += deliveryFeeAmount;
    }

    // Apply sales tax
    totalPrice *= 1.09375; // 9.375% sales tax San Jose
    totalPrice = parseFloat(totalPrice.toFixed(2)); // Round to 2 decimal places

    return {
      totalPrice,
      totalPounds,
      deliveryFee
    }
  }
}

module.exports = orderService;
