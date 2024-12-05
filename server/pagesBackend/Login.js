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

router.post("/login", async (req, res) => {
  const { username, password, isAdmin } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Username and password are required." });
  }

  try {
    if (isAdmin) {
      const [adminResults] = await pool.promise().query(
        `SELECT * FROM adminaccount WHERE username = ?`,
        [username]
      );

      if (adminResults.length > 0) {
        const admin = adminResults[0];

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
          return res
            .status(401)
            .json({ status: "error", message: "Invalid admin username or password." });
        }

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

      return res
        .status(401)
        .json({ status: "error", message: "Invalid admin username or password." });
    } else {
      const [userResults] = await pool.promise().query(
        `SELECT * FROM loginregister WHERE username = ?`,
        [username]
      );

      if (userResults.length > 0) {
        const user = userResults[0];

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

      return res
        .status(401)
        .json({ status: "error", message: "Invalid username or password." });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ status: "error", message: "Database error." });
  }
});

router.get("/verify-admin", async (req, res) => {
  const { username, isAdmin } = JSON.parse(req.headers.username || "{}");

  console.log("Username received in headers:", username);
  console.log("isAdmin received in headers:", isAdmin);

  // Ensure both `username` and `isAdmin` are provided
  if (!username || isAdmin !== true) {
    return res.status(401).json({
      status: "error",
      message: "You must be logged in as an admin to access this resource.",
    });
  }

  try {
    // Query the `adminaccount` table for the user
    const [adminResults] = await pool
      .promise()
      .query(`SELECT is_admin, isApproved FROM adminaccount WHERE username = ?`, [username]);

    console.log("Admin query results:", adminResults);

    if (adminResults.length > 0) {
      const { is_admin, isApproved } = adminResults[0];

      // Check if the user is an admin and is approved
      if (is_admin === 1 && isApproved === 1) {
        return res.status(200).json({
          status: "success",
          message: "Admin access granted.",
          isAdmin: true,
          isApproved: true,
        });
      }
    }

    // Deny access if user is not an admin or not approved
    return res.status(403).json({
      status: "fail",
      message: "Access denied. Admin privileges required.",
      isAdmin: false,
      isApproved: false,
    });
  } catch (error) {
    console.error("Error verifying admin:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Database error occurred during verification.",
    });
  }
});

// Edit Password Route
router.put("/update-password", async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body;

  if (!username || !email || !currentPassword || !newPassword) {
    return res.status(400).json({
      status: "error",
      message: "All fields (username, email, currentPassword, newPassword) are required.",
    });
  }

  try {
    // First, check the loginregister table
    const [userResults] = await pool
      .promise()
      .query(`SELECT * FROM loginregister WHERE username = ?`, [username]);

    let user = userResults.length > 0 ? userResults[0] : null;
    let isAdmin = false;

    // If the user is not found in loginregister, check the adminaccount table
    if (!user) {
      const [adminResults] = await pool
        .promise()
        .query(`SELECT * FROM adminaccount WHERE username = ?`, [username]);

      if (adminResults.length > 0) {
        user = adminResults[0];
        isAdmin = true; // Flag to indicate the user is an admin
      }
    }

    // If no user is found in either table, return an error
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found." });
    }

    // Validate the provided email matches the one in the database
    if (user.email !== email) {
      return res.status(401).json({
        status: "error",
        message: "Provided email does not match our records.",
      });
    }

    // Validate the current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", message: "Current password is incorrect." });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update only the password in the appropriate table
    const updateQuery = isAdmin
      ? `UPDATE adminaccount SET password = ? WHERE username = ?`
      : `UPDATE loginregister SET password = ? WHERE username = ?`;

    const [updateResult] = await pool
      .promise()
      .query(updateQuery, [hashedNewPassword, username]);

    if (updateResult.affectedRows > 0) {
      return res
        .status(200)
        .json({ status: "success", message: "Password updated successfully." });
    } else {
      return res
        .status(500)
        .json({ status: "error", message: "Failed to update password." });
    }
  } catch (error) {
    console.error("Error during account update:", error.message);
    return res
      .status(500)
      .json({ status: "error", message: "Database error." });
  }
});

router.put("/update-email", async (req, res) => {
  const { username, email, password, newEmail } = req.body;

  if (!username || !email || !password || !newEmail) {
    return res.status(400).json({
      status: "error",
      message: "All fields (username, email, password, newEmail) are required.",
    });
  }

  try {
    // First, check the loginregister table
    const [userResults] = await pool
      .promise()
      .query(`SELECT * FROM loginregister WHERE username = ?`, [username]);

    let user = userResults.length > 0 ? userResults[0] : null;
    let isAdmin = false;

    // If the user is not found in loginregister, check the adminaccount table
    if (!user) {
      const [adminResults] = await pool
        .promise()
        .query(`SELECT * FROM adminaccount WHERE username = ?`, [username]);

      if (adminResults.length > 0) {
        user = adminResults[0];
        isAdmin = true; // Flag to indicate the user is an admin
      }
    }

    // If no user is found in either table, return an error
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found." });
    }

    // Validate the provided email matches the one in the database
    if (user.email !== email) {
      return res.status(401).json({
        status: "error",
        message: "Provided email does not match our records.",
      });
    }

    // Validate the current password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", message: "Password is incorrect." });
    }

    // Check if the new email already exists in the appropriate table
    const [existingEmailCheck] = await pool
      .promise()
      .query(
        isAdmin
          ? `SELECT * FROM adminaccount WHERE email = ?`
          : `SELECT * FROM loginregister WHERE email = ?`,
        [newEmail]
      );

    if (existingEmailCheck.length > 0) {
      return res
        .status(409)
        .json({ status: "error", message: "New email is already in use." });
    }

    // Update the email in the appropriate table
    const updateQuery = isAdmin
      ? `UPDATE adminaccount SET email = ? WHERE username = ?`
      : `UPDATE loginregister SET email = ? WHERE username = ?`;

    const [updateResult] = await pool
      .promise()
      .query(updateQuery, [newEmail, username]);

    if (updateResult.affectedRows > 0) {
      return res
        .status(200)
        .json({ status: "success", message: "Email updated successfully." });
    } else {
      return res
        .status(500)
        .json({ status: "error", message: "Failed to update email." });
    }
  } catch (error) {
    console.error("Error during email update:", error.message);
    return res
      .status(500)
      .json({ status: "error", message: "Database error." });
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
