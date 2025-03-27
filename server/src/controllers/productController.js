const Product = require('../models/productModel');
const responseHandler = require('../utils/responseHandler');
const { generateToken, hashPassword, comparePassword } = require('../utils/authUtils');
const validation = require('../utils/validationUtils');

// get single product, route: /api/products/info/:productId
const getProduct = async (req, res) => {
  try {
    //find product by productId
    const { productId } = req.params;
    const product = await Product.findById(productId)

    if (!product) {
      return responseHandler.notFound(res, 'Product not found.');
    }
    responseHandler.success(res, product);

  } catch (error) {
    console.error(`Error getting products:  ${error.message}`, error);

    responseHandler.error(res, `Error getting products : ${error.message}`);
  }
}

// select all products from a category, route: /api/products/category/:category
const getByCategory = async (req, res) => {
  try {
    //find product by category
    const { category } = req.params;
    const products = await Product.findByCategory(category);

    // check for either an empty array or undefined
    if (!products || products.length === 0) {
      return responseHandler.notFound(res, 'Products not found.');
    }
    responseHandler.success(res, products);

  } catch (error) {
    console.error(`Error getting products:  ${error.message}`, error);
    responseHandler.error(res, `Error getting products : ${error.message}`);
  }
}

// create a new product, route: /api/products/create-product, admin only
const createProduct = async (req, res) => {
  try{
    const { category, name, price, pounds, quantity, imageBinary } = req.body;
    const productData = {
      category: category,
      name: name,
      price: price,
      pounds: pounds,
      quantity: quantity,
      imageBinary: imageBinary
    };

    // create product
    const productId = await Product.create(productData);
    if (!productId || !Number.isInteger(productId)) {
      return responseHandler.error(res, 'Error creating product)');
    }
    responseHandler.created(res, { productId }, 'Product created successfully');
  }catch(error){
    console.error(`Error creating product:  ${error.message}`, error);
    responseHandler.error(res, `Error creating product : ${error.message}`);
  }
}

// get all products, route: /api/products/all
const getAllProduct = async (req, res) => {
  try {
    const products = await Product.findAll();
    if (!products || products.length === 0) {
      return responseHandler.notFound(res, 'Products not found.');
    }
    responseHandler.success(res, products);
  } catch (error) {
    console.error(`Error getting products:  ${error.message}`, error);
    responseHandler.error(res, `Error getting products : ${error.message}`);
  }
}

// update a product, route: /api/products/update/:productId, admin only
const updateProduct = async (req, res) => {
  try {
    //update product
    const { productId } = req.params;
    const { category, name, price, pounds, quantity, imageBinary} = req.body;

    const productData = {
      category: category,
      name: name,
      price: price,
      pounds: pounds,
      quantity: quantity,
      imageBinary: imageBinary
    };

    const updated = await Product.update(productId, productData);
    if (!updated) {
      return responseHandler.notFound(res, 'Product not found.');
    }
    responseHandler.success(res, null, 'Product updated successfully');
  } catch (error) {
    console.error(`Error updating product:  ${error.message}`, error);
    responseHandler.error(res, `Error updating product : ${error.message}`);
  }
}

// delete a product, route: /api/products/delete/:productId, admin only
const deleteProduct = async (req, res) => {
  try {
    //Delete Product
    const { productId } = req.params;
    const deleted = await Product.delete(productId);

    if (!deleted) {
      return responseHandler.notFound(res, 'Product not found.');
    }
    responseHandler.success(res, null, 'Product deleted successfully');
  } catch (error) {
    console.error(`Error deleting product:  ${error.message}`, error);
    responseHandler.error(res, `Error deleting product : ${error.message}`);
  }
}
module.exports = {
  getProduct,
  getByCategory,
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct
}
