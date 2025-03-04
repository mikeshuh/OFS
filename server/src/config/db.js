// Import the mysql2 package with promise support for async/await functionality
const mysql = require('mysql2/promise');

// Load environment variables from .env file
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,          // DB host
  user: process.env.DB_USER,          // DB username
  password: process.env.DB_PASS,      // DB password
  database: process.env.DB_NAME,      // DB name
  waitForConnections: true,           // Whether to wait for connections when pool is full
  connectionLimit: 10,                // Maximum connections in the pool
  queueLimit: 0                       // Maximum connection requests to queue (0 = unlimited)
});

// Export the connectrion pool
module.exports = pool;
