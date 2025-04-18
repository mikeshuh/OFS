const Product = require('../models/productModel');
const responseHandler = require('../utils/responseHandler');
const { downloadImage } = require('../tools/downloadImage.js');

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
  try {
    console.log('test');
    const { name, category, price, pounds, quantity } = req.body;


    //console.log(filePath);
    const filePath = req.file.path;
    const imagePath = downloadImage(name, filePath);
    console.log(imagePath);




    const productData = {
      category: category,
      name: name,
      price: price,
      pounds: pounds,
      quantity: quantity,
      imagePath: imagePath
    };

    // create product
    const productId = await Product.create(productData);
    if (!productId || !Number.isInteger(productId)) {
      //delete temp file and image file
      return responseHandler.error(res, 'Error creating product');

    }

    responseHandler.created(res, { productId }, 'Product created successfully');
    //delete temp file
  } catch (error) {
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
    const { category, name, price, pounds, quantity, imagePath } = req.body;

    const productData = {
      category: category,
      name: name,
      price: price,
      pounds: pounds,
      quantity: quantity,
      imagePath: imagePath
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
