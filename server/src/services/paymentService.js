// paymentService.js
const Stripe = require("stripe");
const env = require("../config/env");
const Order = require("../models/orderModel");
const OrderProduct = require("../models/orderProductModel");
const Product = require("../models/productModel");

const stripe = Stripe(env.stripeSecretKey);
const TAX_RATE = 0.091; // Example tax rate (9.1%)

/**
 * Create a Stripe Payment Intent based on an order
 * @param {number} orderID - Order ID for checkout
 * @returns {Promise<Object>} - Returns Stripe Payment Intent
 */
const createPaymentIntent = async (orderID) => {
    try {
        // Fetch order details
        const order = await Order.getById(orderID);
        if (!order) throw new Error("Order not found");

        // Fetch order products
        const orderProducts = await OrderProduct.getByOrderId(orderID);
        if (!orderProducts.length) throw new Error("Order has no products");

        // Calculate total amount including tax
        const taxAmount = Math.round(order.totalPrice * TAX_RATE);
        const totalAmount = order.totalPrice + taxAmount;

        // Create Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100, // Convert to smallest currency unit
            currency: "usd",
            payment_method_types: ["card"],
            metadata: { orderID }
        });

        return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
        console.error("Stripe Payment Error:", error.message);
        throw error;
    }
};

module.exports = { createPaymentIntent };
