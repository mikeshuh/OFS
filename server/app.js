// Main Express application configuration
const express = require('express');
const cors = require('cors');
const env = require('./src/config/env');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Cookie & CSRF
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

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

// parse cookies so we can read/write our JWT & CSRF tokens
app.use(cookieParser());

// Middleware
app.use('/api/payments/webhook', express.raw({ type: 'application/json' })); // Middleware to parse raw JSON for Stripe webhook

// Allow cookies to be sent/received
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CSRF protection for non-GET, non-webhook routes
const csrfProtection = csurf({
  cookie: {
    httpOnly: false,                          // so front-end JS can read the token
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
  },
});
app.use((req, res, next) => {
  // skip CSRF check on GETs and Stripe webhook endpoint
  if (req.method === 'GET' || req.originalUrl === '/api/payments/webhook') {
    return next();
  }
  csrfProtection(req, res, next);
});

// Expose the CSRF token in a cookie named "XSRF-TOKEN"
app.use((req, res, next) => {
  if (req.csrfToken) {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
      secure: env.nodeEnv === 'production',
      sameSite: 'strict',
    });
  }
  next();
});

// Rate limiter that skips only the webhook route
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,                 // limit each IP to 150 requests per windowMs
  skip: (req) =>
    req.originalUrl === '/api/payments/webhook', // do not rate-limit Stripe retries
  message: {
    status: 429,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all /api routes (excluding skipped paths)
app.use('/api', apiLimiter);

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
const deliveryQueue = require('./src/queues/deliveryQueue');

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
  // handle CSRF token errors explicitly
  if (err.code === 'EBADCSRFTOKEN') {
    return responseHandler.error(res, 'Invalid CSRF token', 403);
  }

  console.error(err.stack);
  responseHandler.error(
    res,
    'Something went wrong on the server',
    500,
    env.nodeEnv === 'development' ? { error: err.message } : undefined
  );
});

module.exports = app;
