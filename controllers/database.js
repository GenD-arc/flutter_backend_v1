const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'bjels9630atu3odm3he7-mysql.services.clever-cloud.com',
  user: 'uau4eoezcd8vykqh',
  password: 'xqnNZU6PdszSJkJ4xhRU',
  database: 'bjels9630atu3odm3he7',
  ssl: {
    rejectUnauthorized: false // Required for CleverCloud’s self-signed certificate
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
