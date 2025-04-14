// Main Express application configuration
const express = require('express');
const cors = require('cors');
const env = require('./src/config/env');
const path = require('path');

// Validate environment variables
env.validateEnv();

// Then initialize Redis
const { redisClient } = require('./src/config/redis');
const responseHandler = require('./src/utils/responseHandler');

// Import the delivery job processor to register the job handler
require('./src/queues/deliveryJobProcessor');

// Import routes
const userRoutes = require('./src/routes/userRoute');
const productRoutes = require('./src/routes/productRoute');
const orderRoutes = require('./src/routes/orderRoute');
const paymentRoutes = require('./src/routes/paymentRoute');
const deliveryRoutes = require('./src/routes/deliveryRoute');

// Initialize Express app
const app = express();

// Middleware
app.use('/api/payments/webhook', express.raw({ type: 'application/json' })); // Middleware to parse raw JSON for Stripe webhook
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

// Serve static product images
app.use('/static', express.static(path.join(__dirname, 'src/assets')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/delivery', deliveryRoutes);

// --------------------------------------------------------------
// Bull Board Integration for Monitoring Bull Queues
// --------------------------------------------------------------
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const deliveryQueue = require('./src/queues/deliveryQueue'); // Ensure your deliveryQueue file is here

const bullBoardAdapter = new ExpressAdapter();
bullBoardAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(deliveryQueue)],
  serverAdapter: bullBoardAdapter,
});

// Mount the Bull Board dashboard router at /admin/queues
app.use('/admin/queues', bullBoardAdapter.getRouter());
// --------------------------------------------------------------

// Health check route
app.get('/health', (req, res) => {
  const redisStatus = redisClient.isOpen ? 'connected' : 'disconnected';
  responseHandler.success(
    res,
    { status: 'OK', redis: redisStatus },
    'Server is running'
  );
});

// Root route
app.get('/', (req, res) => {
  responseHandler.success(
    res,
    { documentation: '/api-docs', version: '1.0.0' },
    'Welcome to the OFS API'
  );
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
