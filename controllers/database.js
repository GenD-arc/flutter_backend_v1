const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'bjels9630atu3odm3he7-mysql.services.clever-cloud.com',
  user: process.env.DB_USER || 'uau4eoezcd8vykqh',
  password: process.env.DB_PASSWORD || 'xqnNZU6PdszSJkJ4xhRU',
  database: process.env.DB_NAME || 'bjels9630atu3odm3he7',
  ssl: {
    rejectUnauthorized: false // Required for CleverCloud
  }
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL Database.");
});

module.exports = connection;
