const express = require("express");
const { payment } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route POST /api/payment
 * @desc Process checkout and create a payment intent
 * @access Protected
 */
router.post("/", protect, payment);

module.exports = router;
