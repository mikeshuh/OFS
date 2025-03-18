const calculateTotalAmount = (order) => {
  const TAX_RATE = 0.091; // 9.1% 税
  const productsPrice = parseFloat(order.productsPrice) || 0;
  const deliveryFee = parseFloat(order.deliveryFee) || 0;

  // Step 1: 产品价格 + 配送费
  const basePrice = productsPrice + deliveryFee;

  // Step 2: 计算税
  const tax = parseFloat((basePrice * TAX_RATE).toFixed(2));

  // Step 3: 总价 = 产品 + 配送费 + 税
  const totalWithTax = basePrice + tax;

  console.log(`Calculating Total Amount: basePrice=${basePrice}, tax=${tax}, total=${totalWithTax}`);

  // Step 4: Stripe 用 cents，所以乘100
  return Math.round(totalWithTax * 100);
};

module.exports = { calculateTotalAmount };
