// Utility for input validation and sanitization
// Provides functions for validating and sanitizing user inputs

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password (minimum 8 characters)
const isValidPassword = (password) => {
  return password && password.length >= 8;
};

// Sanitize string (trim whitespace)
const sanitizeString = (str) => {
  return str ? str.trim() : '';
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

// Parse ID from string to integer
const parseId = (id) => {
  return parseInt(id, 10);
};

// Sanitize integer (ensure it's an integer)
const sanitizeInteger = (value) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
};

// Validate payment input (example: check if orderID is integer)
const validatePaymentInput = (paymentData) => {
  const errors = [];
  if (!paymentData.orderID || isNaN(parseInt(paymentData.orderID))) {
    errors.push('Invalid orderID');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};


module.exports = {
  isValidEmail,
  isValidPassword,
  sanitizeString,
  sanitizeEmail,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  parseId,
  sanitizeInteger,
  validatePaymentInput
};
