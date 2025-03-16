// paymentUtils.js
const calculateTotalAmount = (order) => {
  let total = order.totalPrice;
  const TAX_RATE = 0.091;
  total += Math.round(order.totalPrice * TAX_RATE);
  return total * 100;
};

module.exports = { calculateTotalAmount };
