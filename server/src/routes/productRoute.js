const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/info/',productController.getProduct);

module.exports = router;
