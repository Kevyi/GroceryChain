const express = require("express");
const mysql = require("mysql2");

const router = express.Router();

// Middleware to parse JSON request bodies
router.use(express.json());

// Database connection configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "cmpe_131",
};
const pool = mysql.createPool(dbConfig);

// GET: Simple route to indicate the registration route is active
router.get("/register", (req, res) => {
  console.log("GET /register - Registration route is active");
  res.send("Registration route is active. Use POST to submit registration details.");
});

// POST: Registration endpoint
router.post("/register", async (req, res) => {
  const { username, email, password, date_of_birth, country, isAdmin } = req.body;

  if (!username || !email || !password || !date_of_birth || !country) {
    return res.status(400).json({ status: "error", message: "All fields are required." });
  }

  const table = isAdmin ? "adminaccount" : "loginregister";

  try {
    const [checkResults] = await pool.promise().query(
      `SELECT * FROM ${table} WHERE username = ? OR email = ?`,
      [username, email]
    );

    if (checkResults.length > 0) {
      return res.status(409).json({ status: "error", message: "Username or email already exists." });
    }

    const [insertResults] = await pool.promise().query(
      `INSERT INTO ${table} (username, email, password, date_of_birth, country) VALUES (?, ?, ?, ?, ?)`,
      [username, email, password, date_of_birth, country]
    );

    if (insertResults.affectedRows > 0) {
      const message = isAdmin
        ? "Admin registration successful."
        : "User registration successful.";
      return res.status(201).json({ status: "success", message });
    } else {
      return res.status(500).json({ status: "error", message: "Failed to register user." });
    }
  } catch (error) {
    console.error("SQL Error:", error.message);
    return res.status(500).json({ status: "error", message: `Database error: ${error.message}` });
  }
});

// Export the router
module.exports = router;
