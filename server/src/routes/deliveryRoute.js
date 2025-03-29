const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { protect  } = require('../middleware/authMiddleware');

router.post('/geocode', protect, deliveryController.getGeocode);

router.post('/route', protect, deliveryController.getRoute);

router.post('/distance', protect, deliveryController.getDistance);

router.post('/duration', protect, deliveryController.getDuration);

router.post('/optimize', protect, deliveryController.getOptimalRoute);

router.post('/check', protect, deliveryController.checkDeliveryRadius);

module.exports = router;
