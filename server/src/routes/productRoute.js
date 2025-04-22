const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer  = require('multer')
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateParamInt, validateParamString, validateProduct, imageFileFilter,  } = require('../utils/validationUtils');


const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10mb allowance for images
    files: 1
  },
});

// unprotected routes
router.get('/:productId', validateParamInt('productId'), productController.getProduct);

router.get('/category/:category', validateParamString('category'), productController.getByCategory);

router.get('/', productController.getAllProduct);

// routed that require admin
router.post('/create-product', protect, admin, upload.single('image'), validateProduct, productController.createProduct);

router.put('/update-product/:productId', protect, admin, validateParamInt('productId'), upload.single('image'), validateProduct, productController.updateProduct);

router.delete('/delete-product/:productId', protect, admin, validateParamInt('productId'), productController.deleteProduct);

module.exports = router;
