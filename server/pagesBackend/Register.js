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

// GET: Simple route to indicate the registration route is active
router.get("/register", (req, res) => {
  console.log("GET /register - Registration route is active");
  res.send("Registration route is active. Use POST to submit registration details.");
});

router.post("/register", async (req, res) => {
  const { username, email, password, date_of_birth, country, isAdmin } = req.body;

  if (!username || !email || !password || !date_of_birth || !country) {
    return res.status(400).json({ status: "error", message: "All fields are required." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    if (isAdmin) {
      // Check if the username or email already exists in the `adminaccount` table
      const [checkResults] = await pool.promise().query(
        `SELECT * FROM adminaccount WHERE username = ? OR email = ?`,
        [username, email]
      );

      if (checkResults.length > 0) {
        return res.status(409).json({ status: "error", message: "Username or email already exists." });
      }

      // Add to `adminaccount` with `isApproved = 0`
      const [insertAdmin] = await pool.promise().query(
        `INSERT INTO adminaccount (username, email, password, date_of_birth, country, isApproved) VALUES (?, ?, ?, ?, ?, 0)`,
        [username, email, hashedPassword, date_of_birth, country]
      );

      if (insertAdmin.affectedRows > 0) {
        return res.status(201).json({
          status: "pending",
          message: "Registration is pending approval by an administrator.",
        });
      } else {
        return res.status(500).json({ status: "error", message: "Failed to register admin." });
      }
    } else {
      // Check if the username or email already exists in the `loginregister` table
      const [checkResults] = await pool.promise().query(
        `SELECT * FROM loginregister WHERE username = ? OR email = ?`,
        [username, email]
      );

      if (checkResults.length > 0) {
        return res.status(409).json({ status: "error", message: "Username or email already exists." });
      }

      // Add to `loginregister` table
      const [insertUser] = await pool.promise().query(
        `INSERT INTO loginregister (username, email, password, date_of_birth, country) VALUES (?, ?, ?, ?, ?)`,
        [username, email, hashedPassword, date_of_birth, country]
      );

      if (insertUser.affectedRows > 0) {
        return res.status(201).json({
          status: "success",
          message: "Registration successful! You can now log in.",
        });
      } else {
        return res.status(500).json({ status: "error", message: "Failed to register user." });
      }
    }
  } catch (error) {
    console.error("SQL Error:", error.message);
    return res.status(500).json({ status: "error", message: `Database error: ${error.message}` });
  }
});


router.get("/pending-admins", async (req, res) => {
  try {
    // Fetch admins where isApproved is 0
    const [pendingAdmins] = await pool.promise().query(
      "SELECT * FROM adminaccount WHERE isApproved = 0"
    );

    if (pendingAdmins.length > 0) {
      return res.status(200).json({ status: "success", data: pendingAdmins });
    } else {
      return res
        .status(200)
        .json({ status: "success", data: [], message: "No pending admins found." });
    }
  } catch (error) {
    console.error("Error fetching pending admins:", error.message);
    return res.status(500).json({ status: "error", message: "Database error." });
  }
});

router.post("/approve-admin", async (req, res) => {
  const { username, action } = req.body; // Use username instead of adminId

  if (!username || !action) {
    return res.status(400).json({ status: "error", message: "Username and action are required." });
  }

  try {
    if (action === "approve") {
      // Approve the admin by setting isApproved = 1
      const [approveAdmin] = await pool.promise().query(
        "UPDATE adminaccount SET isApproved = 1 WHERE username = ?",
        [username]
      );

      if (approveAdmin.affectedRows > 0) {
        return res.status(200).json({ status: "success", message: "Admin approved successfully." });
      } else {
        return res.status(500).json({ status: "error", message: "Failed to approve admin." });
      }
    } else if (action === "reject") {
      // Reject the admin by removing the entry
      const [rejectAdmin] = await pool.promise().query(
        "DELETE FROM adminaccount WHERE username = ? AND isApproved = 0",
        [username]
      );

      if (rejectAdmin.affectedRows > 0) {
        return res.status(200).json({ status: "success", message: "Admin rejected successfully." });
      } else {
        return res.status(500).json({ status: "error", message: "Failed to reject admin." });
      }
    } else {
      return res.status(400).json({ status: "error", message: "Invalid action." });
    }
  } catch (error) {
    console.error("Error approving/rejecting admin:", error.message);
    return res.status(500).json({ status: "error", message: "Database error." });
  }
});

// Export the router
module.exports = router;
