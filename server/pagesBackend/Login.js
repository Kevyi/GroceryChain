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

router.get("/login", (req, res) => {
  console.log("GET /login - Login route is active");
  res.send("Login route is active. Use POST to submit login details.");
});

// Login route
router.post("/login", (req, res) => {
  const { username, password, isAdmin } = req.body;

  console.log("POST /login called");
  console.log("Request Body:", req.body);

  if (!username || !password) {
    console.log("Validation Error: Missing username or password");
    return res
      .status(400)
      .json({ status: "fail", message: "Username and password are required." });
  }

  const table = isAdmin ? "adminaccount" : "loginregister";
  console.log("Determined Table:", table);

  const query = `SELECT password FROM ${table} WHERE username = ?`;
  console.log("Constructed Query:", query);

  pool.execute(query, [username], (err, results) => {
    if (err) {
      console.error("SQL Error:", err.message);
      return res
        .status(500)
        .json({ status: "error", message: `SQL error: ${err.message}` });
    }

    console.log("Query Results:", results);

    if (results.length > 0) {
      const dbPassword = results[0].password;
      console.log("Database Password:", dbPassword);
      console.log("Provided Password:", password);

      if (password === dbPassword) {
        // Determine role and respond accordingly
        return res.json({
          status: "success",
          message: isAdmin
            ? "Admin login successful"
            : "Customer login successful",
          isAdmin, // Pass admin status to frontend
        });
      } else {
        console.log("Password Mismatch: Login failed");
        return res
          .status(401)
          .json({ status: "fail", message: "Incorrect password." });
      }
    } else {
      const message = isAdmin ? "Admin not found." : "User not found.";
      console.log("User Not Found:", message);
      return res.status(404).json({ status: "fail", message });
    }
  });
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
