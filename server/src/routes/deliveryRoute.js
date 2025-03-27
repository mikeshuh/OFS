const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { protect  } = require('../middleware/authMiddleware');

router.get('/geocode', protect, deliveryController.getGeocode);

router.get('/route', protect, deliveryController.getRoute);

router.get('/distance', protect, deliveryController.getDistance);

router.get('/duration', protect, deliveryController.getDuration);

router.get('/optimize', protect, deliveryController.getOptimalRoute);

router.get('/check', protect, deliveryController.checkDeliveryRadius);

module.exports = router;
