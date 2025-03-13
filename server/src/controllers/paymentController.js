const { createPaymentIntent } = require("../services/paymentService");

const payment = async (req, res) => {
    try {
      console.log("✅ Received payment request:", req.body); 
  
      const { amount, currency } = req.body;
  
      if (!amount || !currency) {
        return res.status(400).json({ error: "Amount and currency are required" });
      }
  
      const paymentIntent = await createPaymentIntent(amount, currency);
      res.json({ clientSecret: paymentIntent.client_secret });
  
    } catch (error) {
      console.error("Payment Intent Error:", error.message);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  };

  
module.exports = {
    payment
  };
  
  