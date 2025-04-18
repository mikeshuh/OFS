const env = require('./src/config/env');
env.validateEnv();
const { redisClient } = require('./src/config/redis');
const app = require('./app');
const deliveryQueueService = require('./src/services/deliveryQueueService');

const PORT = env.port;

(async () => {
  await deliveryQueueService.loadUnqueuedOrdersIntoMemory();

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });

  const gracefulShutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('HTTP server closed.');
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

    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down.');
      process.exit(1);
    }, 10000);
  };

  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
  });

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
})();
