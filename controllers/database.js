const mysql = require('mysql2'); // Switch to mysql2

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // Required for CleverCloud
  },
  connectionLimit: 10, // Max connections in pool
  acquireTimeout: 60000, // Timeout for acquiring connection (60s)
  timeout: 60000, // Idle timeout (60s)
  reconnect: true // Auto-reconnect on loss
});

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL Database.");
  connection.release(); // Release the test connection back to pool
});

module.exports = pool; // Export the pool
