// Utility for input validation and sanitization
// Provides functions for validating and sanitizing user inputs
const { body, param, validationResult } = require('express-validator');
const responseHandler = require('../utils/responseHandler');


// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidString = (str) => {
  return str && str.length > 0 && str.length < 255;
};

// Validate password (minimum 8 characters)
const isValidPassword = (password) => {
  return password && password.length >= 8;
};

// Sanitize string (trim whitespace)
const sanitizeString = (str) => {
  return str ? str.trim() : '';
};

// Sanitize BLOB (right now no sanitization, will do in the future)
const sanitizeBLOB = (blob) => {
  return blob ? blob : null;
}
// Sanitize number
const sanitizeInteger = (num) => {
  return num ? parseInt(num, 10) < 1e9 ? parseInt(num,10) : null : null;
};

const sanitizeFloat = (num) => {
  return num ? parseFloat(num) < 1e9 ? parseFloat(num) : null : null;
};

// Sanitize email (trim and lowercase)
const sanitizeEmail = (email) => {
  return email ? email.trim().toLowerCase() : '';
};

// Validate user registration input
const validateRegistration = (userData) => {
  const { firstName, lastName, email, password } = userData;
  const errors = [];

  // Check required fields
  if (!firstName || !lastName || !email || !password) {
    errors.push('All fields are required (firstName, lastName, email, password)');
  }

  // Validate email format
  if (email && !isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  // Validate password
  if (password && !isValidPassword(password)) {
    errors.push('Password must be at least 8 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate login input
const validateLogin = (loginData) => {
  const { email, password } = loginData;
  const errors = [];

  // Check required fields
  if (!email || !password) {
    errors.push('Email and password are required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate profile update input
const validateProfileUpdate = (profileData) => {
  const { firstName, lastName, email } = profileData;
  const errors = [];

  // Check if at least one field is provided
  if (!firstName && !lastName && !email) {
    errors.push('At least one field is required for update');
  }

  // Validate email format if provided
  if (email && !isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate password change input
const validatePasswordChange = (passwordData) => {
  const { currentPassword, newPassword } = passwordData;
  const errors = [];

  // Check required fields
  if (!currentPassword || !newPassword) {
    errors.push('Current password and new password are required');
  }

  // Validate new password
  else if (!isValidPassword(newPassword)) {
    errors.push('New password must be at least 8 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
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
  .isLength({min: 0, max: 16})
  .withMessage('Category must be less than 16 characters'),

  //sanitize name
  body('name')
  .trim()
  .escape()
  //validate
  .notEmpty()
  .withMessage('Name is required')
  .isString()
  .isLength({min: 0, max: 32})
  .withMessage('Name must be less than 32 characters'),

  //sanitize
  body('price')
  .trim()
  .escape()
  //validate
  .notEmpty()
  .withMessage('Price is required')
  .toFloat()
  .isFloat({min: 0})
  .withMessage('Price must be positive a positive float'),

  //sanitize
  body('pounds')
  .trim()
  .escape()
  //validate
  .notEmpty()
  .withMessage('Pounds is required')
  .toFloat()
  .isFloat({min: 0})
  .withMessage('Pounds must be a positive float'),

  //sanitize
  body('quantity')
  .trim()
  .escape()
  //validate
  .notEmpty()
  .withMessage('Quantity is required')
  .toInt()
  .isInt({min: 0})
  .withMessage('Quantity must be a positive integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    // Multer may not upload file if it gets filtered
    if (!req.file) {
      return responseHandler.error(res, "image was filtered");
    }


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

//validate image
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    //if file is not of the correct type multer will not upload it
    cb(null, false);
  }
};

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

const validateParamInt = (paramName) => {
  return [
    param(paramName)
    .escape()
    .trim()
    .toInt()
    .isInt()
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

// Parse ID from string to integer
const parseId = (id) => {
  return parseInt(id, 10);
};

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
  isValidEmail,
  isValidPassword,
  sanitizeString,
  sanitizeEmail,
  sanitizeFloat,
  sanitizeInteger,
  sanitizeBLOB,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  parseId,
  //Product Route Validation
  validateProduct,
  imageFileFilter,
  validateOrder,
  validateParamInt,
  validateParamString,
  validateRoute,
  validateAddress,
  validateOptimalRoute,
  validatePaymentIntent,

};
