const calculateTotalAmount = (order) => {
  const TAX_RATE = 0.091; // 9.1% tax
  const productsPrice = parseFloat(order.productsPrice) || 0;
  const deliveryFee = parseFloat(order.deliveryFee) || 0;

  const basePrice = productsPrice + deliveryFee;

  // calculating tax
  const tax = parseFloat((basePrice * TAX_RATE).toFixed(2));

  // total price = product price + delivery + tax
  const totalWithTax = basePrice + tax;

  console.log(`Calculating Total Amount: basePrice=${basePrice}, tax=${tax}, total=${totalWithTax}`);

  // Stripe using cents，so times 100
  return Math.round(totalWithTax * 100);
};

module.exports = { calculateTotalAmount };
