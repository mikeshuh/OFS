const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateParamInt, validateParamString, validateProduct } = require('../utils/validationUtils');

// unprotected routes
router.get('/:productId', validateParamInt('productId'), productController.getProduct);

router.get('/search/:searchTerm', validateParamString('searchTerm'), productController.getBySearch);

router.get('/category/:category', validateParamString('category'), productController.getByCategory);

router.get('/', productController.getAllProduct);

// routed that require admin
router.post('/create-product', protect, admin, validateProduct, productController.createProduct);

router.put('/update-product/:productId', protect, admin, validateParamInt('productId'), validateProduct, productController.updateProduct);

router.delete('/delete-product/:productId', protect, admin, validateParamInt('productId'), productController.deleteProduct);

module.exports = router;
