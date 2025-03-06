// Utility for standardized API responses

// Success response with data
const success = (res, data = null, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Error response
const error = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

// Not found response
const notFound = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message
  });
};

// Bad request response
const badRequest = (res, message = 'Bad request', errors = null) => {
  return res.status(400).json({
    success: false,
    message,
    errors
  });
};

// Unauthorized response
const unauthorized = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    success: false,
    message
  });
};

// Forbidden response
const forbidden = (res, message = 'Access forbidden') => {
  return res.status(403).json({
    success: false,
    message
  });
};

// Created response
const created = (res, data = null, message = 'Resource created successfully') => {
  return res.status(201).json({
    success: true,
    message,
    data
  });
};

module.exports = {
  success,
  error,
  notFound,
  badRequest,
  unauthorized,
  forbidden,
  created
};
