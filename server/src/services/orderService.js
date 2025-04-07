const Product = require('../models/productModel');

const orderService = {
  calculateTotalPrice: async (orderProducts) => {
    let totalPrice = 0;
    let totalPounds = 0;
    let deliveryFee = false;
    const DELIVERY_FEE_AMOUNT = 10; // hardcoded delivery fee amount
    const SALES_TAX_RATE = 0.09375; // 9.375% sales tax for San Jose

    //calculate total pounds and total price
    for (const orderProduct of orderProducts) {
      const productDetails = await Product.findById(orderProduct.productID);
      if (!productDetails) {
        throw new Error(`Product with ID ${orderProduct.productID} not found.`);
      }
      totalPrice += productDetails.price * orderProduct.cartQuantity;
      totalPounds += productDetails.pounds * orderProduct.cartQuantity;
    }

    //determine if there is a delivery fee
    if (totalPounds >= 20){
      deliveryFee = true;
      totalPrice += DELIVERY_FEE_AMOUNT;
    }

    // Apply sales tax
    totalPrice *= (1 + SALES_TAX_RATE); // 9.375% sales tax San Jose
    totalPrice = parseFloat(totalPrice.toFixed(2)); // Round to 2 decimal places

    return {
      totalPrice,
      totalPounds,
      deliveryFee
    }
  }
}

module.exports = orderService;
