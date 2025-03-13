const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

// Handle connection events
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});

// Establish connection
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

// Define async functions using native promises with proper options handling
const setAsync = async (key, value, options = {}) => {
  return await redisClient.set(key, value, options);
};

const getAsync = async (key) => {
  return await redisClient.get(key);
};

const existsAsync = async (key) => {
  return await redisClient.exists(key);
};

const delAsync = async (key) => {
  return await redisClient.del(key);
};

// Function to check if Redis is available
const isRedisAvailable = () => {
  return redisClient.isOpen;
};

module.exports = {
  redisClient,
  setAsync,
  getAsync,
  existsAsync,
  delAsync,
  isRedisAvailable
};
