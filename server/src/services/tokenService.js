const { setAsync, existsAsync } = require('../config/redis');
const { verifyToken } = require('../utils/authUtils');

const TokenService = {
  // Add token to blacklist
  blacklistToken: async (token, userId) => {
    try {
      // Verify the token to get its expiration time
      const decoded = verifyToken(token);

      // Calculate TTL in seconds
      const tokenExp = decoded.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const ttl = tokenExp - currentTime;

      if (ttl <= 0) {
        // Token already expired, no need to blacklist
        return true;
      }

      // Store in Redis with expiration - updated for new Redis client
      await setAsync(`bl_token_${token}`, userId.toString(), { EX: ttl });
      return true;
    } catch (error) {
      console.error('Error blacklisting token:', error);
      throw error;
    }
  },

  // Check if token is blacklisted
  isBlacklisted: async (token) => {
    try {
      // Check if token exists in Redis - this method returns a number in v4+
      const exists = await existsAsync(`bl_token_${token}`);
      return exists > 0;
    } catch (error) {
      console.error('Error checking blacklisted token:', error);
      throw error;
    }
  }
};

module.exports = TokenService;
