const Queue = require('bull');
const env = require('../config/env');

const deliveryQueue = new Queue('deliveryQueue', {
  redis: {
    host: env.redisHost || 'localhost',
    port: env.redisPort || 6379,
  }
});

module.exports = deliveryQueue;
