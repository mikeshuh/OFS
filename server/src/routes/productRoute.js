const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// unprotected routes
router.get('/:productId',productController.getProduct);

router.get('/category/:category',productController.getByCategory);

router.get('/',productController.getAllProduct);
// routed that require admin
router.post('/create-product',protect, admin, productController.createProduct);

router.put('/update-product/:productId',protect, admin, productController.updateProduct);

router.delete('/delete-product/:productId',protect, admin, productController.deleteProduct);

module.exports = router;
