const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

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

// Login route
router.post("/login", async (req, res) => {
  const { username, password, isAdmin } = req.body; // Include `isAdmin` flag from the frontend

  if (!username || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Username and password are required." });
  }

  try {
    if (isAdmin) {
      // Check if the user is an admin
      const [adminResults] = await pool.promise().query(
        `SELECT * FROM adminaccount WHERE username = ?`,
        [username]
      );

      if (adminResults.length > 0) {
        const admin = adminResults[0];

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
          return res
            .status(401)
            .json({ status: "error", message: "Invalid admin username or password." });
        }

        // Check approval status
        if (admin.isApproved === 0) {
          return res.status(403).json({
            status: "error",
            message: "Your admin account is not approved yet. Please wait for approval.",
          });
        }

        // Admin login success
        return res.status(200).json({
          status: "success",
          message: "Admin login successful.",
          isAdmin: true,
          username: admin.username,
        });
      }

      // If no admin match is found
      return res
        .status(401)
        .json({ status: "error", message: "Invalid admin username or password." });
    } else {
      // Check if the user is a regular user
      const [userResults] = await pool.promise().query(
        `SELECT * FROM loginregister WHERE username = ?`,
        [username]
      );

      if (userResults.length > 0) {
        const user = userResults[0];

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res
            .status(401)
            .json({ status: "error", message: "Invalid username or password." });
        }

        // Regular user login success
        return res.status(200).json({
          status: "success",
          message: "Login successful.",
          isAdmin: false,
          username: user.username,
        });
      }

      // If no regular user match is found
      return res
        .status(401)
        .json({ status: "error", message: "Invalid username or password." });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ status: "error", message: "Database error." });
  }
});


// Admin: Update cart endpoint
router.post("/admin/cart", (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ status: "fail", message: "Product ID and quantity are required." });
  }

  const query = "UPDATE cart SET quantity = ? WHERE productId = ?";
  pool.execute(query, [quantity, productId], (err, results) => {
    if (err) {
      console.error("SQL Error:", err.message);
      return res
        .status(500)
        .json({ status: "error", message: `SQL error: ${err.message}` });
    }

    console.log("Cart Updated:", results);
    return res.json({ status: "success", message: "Cart updated successfully." });
  });
});

// Customer: View and manage cart endpoint
router.get("/customer/cart", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res
      .status(400)
      .json({ status: "fail", message: "Username is required." });
  }

  const query = "SELECT * FROM cart WHERE username = ?";
  pool.execute(query, [username], (err, results) => {
    if (err) {
      console.error("SQL Error:", err.message);
      return res
        .status(500)
        .json({ status: "error", message: `SQL error: ${err.message}` });
    }

    console.log("Cart Retrieved:", results);
    return res.json({ status: "success", cart: results });
  });
});

module.exports = router;
