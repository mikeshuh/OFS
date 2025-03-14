const Product = require('../models/productModel');
const responseHandler = require('../utils/responseHandler');
const { generateToken, hashPassword, comparePassword } = require('../utils/authUtils');
const validation = require('../utils/validationUtils');

const getProduct = async (req, res) => {
  try {
    const validationResult = validation.validateProduct(req.body);
    if (!validationResult.isValid) {
      return responseHandler.badRequest(res, validationResult.errors[0], validationResult.errors);
    }

    const { productId } = req.body;

    const sanitizedProductId = validation.sanitizeInteger(productId);
    const product = await Product.findById(sanitizedProductId);
    if (!product) {
      return responseHandler.notFound(res, 'Product not found.');
    }
    responseHandler.success(res, product);

  } catch (error) {
    console.error(`Error getting products:  ${error.message}`, error);

    responseHandler.error(res, `Error getting products : ${error.message}`);
  }
}

module.exports = {
  getProduct
}
