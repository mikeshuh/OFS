const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer  = require('multer')
const path = require('path');
const upload = multer({ dest: path.join(__dirname, '../tools/raw/') });

const { protect, admin } = require('../middleware/authMiddleware');
const { validateParamInt, validateParamString, validateProduct } = require('../utils/validationUtils');

// unprotected routes
router.get('/:productId', validateParamInt('productId'), productController.getProduct);

router.get('/category/:category', validateParamString('category'), productController.getByCategory);

router.get('/', productController.getAllProduct);

// routed that require admin
router.post('/create-product', protect, admin, upload.single('image'), productController.createProduct);

router.put('/update-product/:productId', protect, admin, validateParamInt('productId'), validateProduct, productController.updateProduct);

router.delete('/delete-product/:productId', protect, admin, validateParamInt('productId'), productController.deleteProduct);

module.exports = router;
