// Server entry point
const env = require('./src/config/env');
env.validateEnv();
const { redisClient } = require('./src/config/redis');
const app = require('./app');

// Get port from environment or use default
const PORT = env.port;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${env.nodeEnv} mode on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// gracefulShutdown function
const gracefulShutdown = () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    // Close Redis connection - updated for new Redis client
    if (redisClient.isOpen) {
      redisClient.quit().then(() => {
        console.log('Redis connection closed.');
        process.exit(0);
      }).catch(err => {
        console.error('Error closing Redis connection:', err);
        process.exit(1);
      });
    } else {
      console.log('Redis connection already closed.');
      process.exit(0);
    }
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown for SIGTERM and SIGINT
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
