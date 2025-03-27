const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const validation = require('../utils/validationUtils');


// unprotected routes
router.get('/:productId', validation.validateParamInt('productId'), productController.getProduct);


router.get('/category/:category', validation.validateParamString('category'), productController.getByCategory);

router.get('/', productController.getAllProduct);
// routed that require admin
router.post('/create-product', protect, admin, validation.validateProduct, productController.createProduct);

router.put('/update-product/:productId', protect, admin, validation.validateParamInt('productId'), validation.validateProduct, productController.updateProduct);

router.delete('/delete-product/:productId', protect, admin, validation.validateParamInt('productId'), productController.deleteProduct);

module.exports = router;
