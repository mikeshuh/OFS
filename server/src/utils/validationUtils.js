// Utility for input validation and sanitization
// Provides functions for validating and sanitizing user inputs

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
}
const validateProductId = (productData) => {
  const { productId} = productData;
  const errors = [];

  // Check required fields
  if (!productId ) {
    errors.push(`Product ID is required `);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateCategory = (categoryData) => {
  const { category } = categoryData;
  const errors = [];

  // Check required fields
  if (!category) {
    errors.push('Category is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

const validateProduct = (productData) => {
  const { category, name, price, pounds, quantity } = productData;
  const errors = [];

  // Check required fields
  if (!category || !name || !price || !pounds || !quantity) {
    errors.push('All fields are required (category, name, price, pounds, quantity)');
  }

  // Validate price
  if (price && price < 0) {
    errors.push('Price must be a positive number');
  }

  // Validate pounds
  if (pounds && pounds < 0) {
    errors.push('Pounds must be a positive number');
  }

  // Validate quantity
  if (quantity && quantity < 0) {
    errors.push('Quantity must be a positive number');
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
}
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
}

// Parse ID from string to integer
const parseId = (id) => {
  return parseInt(id, 10);
};

module.exports = {
  isValidEmail,
  isValidPassword,
  sanitizeString,
  sanitizeEmail,
  sanitizeFloat,
  sanitizeInteger,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  parseId,
  validateProductId,
  validateCategory,
  validateProduct,
  validateRoute,
  validateAddress,
  validateOptimalRoute
};
