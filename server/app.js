// Main Express application configuration
const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./src/config/env');

// Validate environment variables
env.validateEnv();

// Then initialize Redis
const { redisClient } = require('./src/config/redis');
const responseHandler = require('./src/utils/responseHandler');

// Import routes
const userRoutes = require('./src/routes/userRoute');

// product
const productRoutes = require('./src/routes/productRoute');
// order:w
// payment
const paymentRoutes = require("./src/routes/paymentRoute");
// delivery
const deliveryRoutes = require('./src/routes/deliveryRoute');

// Initialize Express app
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
// Raw body parser for Stripe Webhook
app.use('/payment/webhook', express.raw({ type: 'application/json' }));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger for development
if (env.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
  });
}

// API Routes
app.use('/api/users', userRoutes);
// product
app.use('/api/products', productRoutes);
// order
// payment
app.use('/payment', paymentRoutes);
// delivery
app.use('/api/delivery', deliveryRoutes);

// Health check route
app.get('/health', (req, res) => {
  const redisStatus = redisClient.isOpen ? 'connected' : 'disconnected';
  responseHandler.success(res, {
    status: 'OK',
    redis: redisStatus
  }, 'Server is running');
});

// Root route
app.get('/', (req, res) => {
  responseHandler.success(res, {
    documentation: '/api-docs',
    version: '1.0.0'
  }, 'Welcome to the OFS API');
});

// 404 - Route not found
app.use((req, res) => {
  responseHandler.notFound(res, 'Route not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  responseHandler.error(
    res,
    'Something went wrong on the server',
    500,
    env.nodeEnv === 'development' ? { error: err.message } : undefined
  );
});

module.exports = app;
