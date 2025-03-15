const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

router.get('/geocode', deliveryController.getGeocode);

router.get('/route', deliveryController.getRoute);

module.exports = router;
