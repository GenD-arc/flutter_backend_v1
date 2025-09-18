const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const util = require("util");
const connection = require("../controllers/database");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h';

// convert mysql callbacks to promises
const query = util.promisify(connection.query).bind(connection);

// Fallback values if environment variables are not set
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h';

// role-to-path mapping (can move to DB or config file later)
const roleRedirectMap = {
  R02: "/pages/adminDashboard.html",
  R03: "/pages/superAdminDashboard.html",
  R01: "/pages/userDashboard.html", // default user role
};

router.post("/", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    console.log("🔐 Login attempt for:", identifier);
    console.log("🔑 JWT_SECRET exists:", !!JWT_SECRET);

    // Validate input
    if (!identifier || !password) {
      console.log("❌ Missing identifier or password");
      return res.status(400).json({ message: "Username and password are required" });
    }

    const sql = `
      SELECT a.username, a.email, a.password, r.id AS role_id, u.name, u.id as user_id, u.active
      FROM accounts a
      JOIN users u ON a.user_id = u.id
      JOIN roles r ON u.role_id = r.id
      WHERE (BINARY a.email = ? OR BINARY a.username = ?)
      LIMIT 1
    `;

    console.log("🔍 Searching for user with identifier:", identifier);
    const results = await query(sql, [identifier, identifier]);
    console.log("📊 DB query returned", results.length, "results");

    if (results.length === 0) {
      console.log("❌ No user found with identifier:", identifier);
      
      // Debug: Show what users exist (remove this in production!)
      const allUsers = await query("SELECT username, email FROM accounts LIMIT 5");
      console.log("📋 Available usernames:", allUsers.map(u => u.username));
      
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    console.log("👤 Found user:", user.username, "| Role:", user.role_id, "| Active:", user.active);

    // ✅ Check if user is archived/inactive
    if (user.active === 0) {
      console.log("🚫 Login blocked: user is deactivated/archived ->", user.username);
      return res.status(403).json({ message: "Account deactivated. Contact administrator." });
    }

    console.log("🔐 Stored password hash:", user.password.substring(0, 20) + "...");

    // Test password
    console.log("🧪 Testing password:", password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🎯 Password match:", isMatch ? "✅ YES" : "❌ NO");
    
    if (!isMatch) {
      console.log("❌ Password mismatch for user:", user.username);
      
      // Debug: Test with a fresh hash (remove this in production!)
      const testHash = await bcrypt.hash(password, 10);
      console.log("🧪 Test hash for entered password:", testHash);
      const testMatch = await bcrypt.compare(password, testHash);
      console.log("🧪 Test hash matches:", testMatch);
      
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    console.log("🎫 Creating JWT token...");
    const tokenPayload = { 
      username: user.username, 
      role_id: user.role_id,
      user_id: user.user_id 
    };
    console.log("📦 Token payload:", tokenPayload);
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    console.log("✅ JWT token created successfully");

    console.log("🎉 Login successful for:", user.username);

    return res.json({
      token,
      role_id: user.role_id,
      name: user.name,
      username: user.username
    });

  } catch (err) {
    console.error("💥 Login error:", err);
    return res.status(500).json({ 
      error: "Server error", 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

router.get('/test-db', async (req, res) => {
  try {
    const results = await query('SELECT NOW()');
    res.status(200).json({ message: 'Database connected successfully', time: results[0]['NOW()'] });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});


module.exports = router;
