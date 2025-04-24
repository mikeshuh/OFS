// Utility for input validation and sanitization
// Provides functions for validating and sanitizing user inputs
const { body, param, validationResult } = require('express-validator');
const responseHandler = require('../utils/responseHandler');
const multer = require('multer');

// Sanitize string (trim whitespace)
const sanitizeString = (str) => {
  return str ? str.trim() : '';
};

/************************************************************************************************************
 * General validation
 ************************************************************************************************************/

const validateParamInt = (paramName) => {
  return [
    param(paramName)
    .escape()
    .trim()
    .toInt()
    .isInt({ max: 1000000000 })
    .withMessage('Param must be an integer'),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responseHandler.badRequest(res, null, errors);
      }
      next();
    },
  ]
};

const validateParamString = (paramName) => {
  return [
    param(paramName)
    .escape()
    .trim()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Param must be a string'),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responseHandler.badRequest(res, null, errors);
      }
      next();
    },
  ]
};

/************************************************************************************************************
 * User validation
 ************************************************************************************************************/

//validate registration
const validateRegistration = [
  body('firstName')
    .trim()
    .escape()
    .notEmpty().withMessage('First name is required')
    .isString()
    .isLength({ max: 32 }).withMessage('First name must be less than 32 characters'),

  body('lastName')
    .trim()
    .escape()
    .notEmpty().withMessage('Last name is required')
    .isString()
    .isLength({ max: 32 }).withMessage('Last name must be less than 32 characters'),

  body('email')
    .trim()
    .escape()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .isLength({ max: 64 }).withMessage('Email must be less than 64 characters'),

  body('password')
    .trim()
    .escape()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .isLength({ max: 64 }).withMessage("Password must be less than 64 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character (@, $, !, %, *, ?, &)"),

  body('passwordConfirmed')
    .trim()
    .escape()
    .notEmpty().withMessage('Password confirmation is required')
    .isLength({ min: 8 }).withMessage("Password confirmation must be at least 8 characters long")
    .isLength({ max: 64 }).withMessage("Password confirmation must be less than 64 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler.badRequest(res, null, errors);
    }
    next();
  },
];

// Validate login input
const validateLogin = [
  body('email')
    .trim()
    .escape()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .isLength({ max: 64 }).withMessage('Email must be less than 64 characters'),

  body('password')
    .trim()
    .escape()
    .notEmpty().withMessage('Password is required')
    .isLength({ max: 64 }).withMessage("Password must be less than 64 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler.badRequest(res, null, errors);
    }
    next();
  },
];

// Validate password change input
const validatePasswordChange = [
  body('currentPassword')
    .trim()
    .escape()
    .notEmpty().withMessage('Current password is required')
    .isLength({ max: 64 }).withMessage("Current password must be less than 64 characters long"),

  body('newPassword')
    .trim()
    .escape()
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage("New password must be at least 8 characters long")
    .isLength({ max: 64 }).withMessage("New password must be less than 64 characters long")
    .matches(/[A-Z]/).withMessage("New password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("New password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("New password must contain at least one number")
    .matches(/[@$!%*?&]/).withMessage("New password must contain at least one special character (@, $, !, %, *, ?, &)"),

    body('passwordConfirmed')
      .trim()
      .escape()
      .notEmpty().withMessage('Password confirmation is required')
      .isLength({ min: 8 }).withMessage("Password confirmation must be at least 8 characters long")
      .isLength({ max: 64 }).withMessage("Password confirmation must be less than 64 characters long")
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler.badRequest(res, null, errors);
    }
    next();
  },
];

/************************************************************************************************************
 * Product validation
 ************************************************************************************************************/

//validate image
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    //if file is not of the correct type multer will not upload it
    cb(null, false);
  }
};

//handle errors that occur from multer limits
const fileSizeLimitErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return responseHandler.badRequest(res, 'Image Invalid: please choose images less than 10mb in size');
  } else if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_COUNT') {
    return responseHandler.badRequest(res, 'Image Invalid: please only upload one image');
  } else {
    next();
  }
};

//validate product
const validateProduct = [
  //sanitize category
  body('category')
  .trim()
  .escape()
  //validate
  .notEmpty()
  .withMessage('Category is required')
  .isString()
  // Handle casing
  .customSanitizer(value => {
    //remove multiple whitespace characters "chicken  soup"
    const normalizedValue = value.replace(/\s+/g, ' ');
    let words = normalizedValue.split(" ");

    //Handle casing for multiple words chicken soup => Chicken Soup
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    const formattedName = words.join(" ");
    return formattedName;
  })
  .isLength({max: 16})
  .withMessage('Category must be less than 16 characters'),

  //sanitize name
  body('name')
  .trim()
  .escape()
  //validate
  .notEmpty()
  .withMessage('Name is required')
  .isString()
  // Handle casing
  .customSanitizer(value => {
    //remove multiple whitespace characters "chicken  soup"
    const normalizedValue = value.replace(/\s+/g, ' ');
    let words = normalizedValue.split(" ");

    //Handle casing for multiple words chicken soup => Chicken Soup
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    const formattedCategory = words.join(" ");
    return formattedCategory;
  })
  .isLength({max: 32})
  .withMessage('Name must be less than 32 characters'),

  //sanitize
  body('price')
  .trim()
  .escape()
  //validate
  .notEmpty()
  .withMessage('Price is required')
  .toFloat()
  .isFloat({min: 0, max: 10000})
  .withMessage('Price must be positive a positive float'),

  //sanitize
  body('pounds')
  .trim()
  .escape()
  //validate
  .notEmpty()
  .withMessage('Pounds is required')
  .toFloat()
  .isFloat({min: 0, max: 1000})
  .withMessage('Pounds must be a positive float'),

  //sanitize
  body('quantity')
  .trim()
  .escape()
  //validate
  .notEmpty()
  .withMessage('Quantity is required')
  .toInt()
  .isInt({min: 0, max:1000})
  .withMessage('Quantity must be a positive integer'),

  (req, res, next) => {
    const errors = validationResult(req);

    const errorsArray = errors.array();
    let errorMsg = "";
    if (!errors.isEmpty()) {
      errorsArray.forEach(error => {
        errorMsg += error.msg + ". ";
      });

      return responseHandler.badRequest(res, errorMsg, {errors});
    }
    next();
  },
];

/************************************************************************************************************
 * Order validation
 ************************************************************************************************************/

//validate order
const validateOrder = [
  body('streetAddress')
  .trim()
  .escape()
  .isString(),

  body('city')
  .trim()
  .escape()
  .isString(),

  body('zipCode')
  .trim()
  .escape()
  .toInt()
  .isInt(),

  body('orderProducts')
  .isArray({ min: 1 })
  .withMessage('At least one order product is required'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return responseHandler.badRequest(res, null, errors);
    }
    next();
  },
];

/************************************************************************************************************
 * Delivery validation
 ************************************************************************************************************/

const validateOptimalRoute = (req) => {
  const { addresses } = req;
  const errors = [];
  if (!addresses || addresses.length < 2) {
    errors.push('At least two addresses are required');
  }
  for (let i = 0; i < addresses.length; i++) {
    if (!validateAddress(addresses[i]).isValid) {
      errors.push(`Invalid address at index ${i}`);
    }
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateAddress = (req) => {
  const { streetAddress,zipCode,city } = req;
  const errors = [];

  // Check required fields
  if (!streetAddress || !zipCode || !city) {
    errors.push('All fields are required (streetAddress, city, zipCode)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateRoute = (req) => {
  const { origin, destination } = req;
  const errors = [];

  if (!validateAddress(origin).isValid) {
    errors.push('Invalid origin address');
  }

  if (!validateAddress(destination).isValid) {
    errors.push('Invalid destination address');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

/************************************************************************************************************
 * Payment validation
 ************************************************************************************************************/

// Payment intent req body validation
const validatePaymentIntent = [
  body('orderID')
  .trim()
  .escape()
  .toInt()
  .isInt({ max: 1000000000 })
  .withMessage('Order ID must be an integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler.badRequest(res, null, errors);
    }
    next();
  },
];

module.exports = {
  sanitizeString,
  validateParamInt,
  validateParamString,
  validateRegistration,
  validateLogin,
  validatePasswordChange,
  validateProduct,
  validateOrder,
  validateRoute,
  validateAddress,
  validateOptimalRoute,
  validatePaymentIntent,
  fileSizeLimitErrorHandler,
  imageFileFilter
};
