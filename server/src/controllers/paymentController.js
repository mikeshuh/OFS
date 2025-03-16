const { createPaymentIntent } = require("../services/paymentService");
const Order = require("../models/orderModel");
const responseHandler = require("../utils/responseHandler");

/**
 * Process checkout and create a payment intent
 */
const payment = async (req, res) => {
    try {
        const { orderID } = req.body;
        if (!orderID) return responseHandler.badRequest(res, "Order ID is required");

        const order = await Order.getById(orderID);
        if (!order) return responseHandler.notFound(res, "Order not found");
        if (order.orderStatus !== "PENDING") return responseHandler.badRequest(res, "Order already processed");

        const paymentIntent = await createPaymentIntent(orderID);
        return responseHandler.success(res, paymentIntent, "Payment intent created successfully");
    } catch (error) {
        console.error("Payment Error:", error.message);
        return responseHandler.error(res, "Failed to process payment");
    }
};

module.exports = { payment };
