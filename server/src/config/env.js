// This file centralizes environment variable configuration

// Load environment variables from .env file
require('dotenv').config();

// Export environment variables
module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // Redis configuration
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || 6379,

  // Stripe configuration
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

  // Validation to ensure critical variables exist
  validateEnv: () => {
    const required = [
      'DB_HOST',
      'DB_USER',
      'DB_PASS',
      'DB_NAME',
      'JWT_SECRET',
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY',
      'STRIPE_WEBHOOK_SECRET'
    ];

    // Optional but recommended Redis variables
    const recommended = [
      'REDIS_HOST',
      'REDIS_PORT'
    ];

    const missing = required.filter(key => !process.env[key]);
    const missingRecommended = recommended.filter(key => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    if (missingRecommended.length > 0) {
      console.warn(`Warning: Missing recommended environment variables: ${missingRecommended.join(', ')}`);
      console.warn('Using default values for missing variables');
    }

    return true;
  }
};
