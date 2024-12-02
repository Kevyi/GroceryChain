const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const router = express.Router();

// Middleware
router.use(cors());
router.use(express.json());

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "cmpe_131",
};

const pool = mysql.createPool(dbConfig);

// Simple GET route to verify the CreditCard route is active
router.get("/creditcard", (req, res) => {
  console.log("GET /creditcard - CreditCard route is active");
  res.json({
    status: "success",
    message: "CreditCard route is active. Use POST to validate credit card details.",
  });
});

// POST: Validate Credit Card Information
router.post("/creditcard", async (req, res) => {
  const requiredFields = [
    "full_name",
    "address",
    "city",
    "state",
    "zip_code",
    "card_name",
    "card_number",
    "exp_month",
    "exp_year",
    "cvv",
  ];

  // Validate input fields
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ status: "fail", message: `Missing fields: ${missingFields.join(", ")}` });
  }

  const {
    full_name,
    address,
    city,
    state,
    zip_code,
    card_name,
    card_number,
    exp_month,
    exp_year,
    cvv,
  } = req.body;

  const query = `
    SELECT id FROM CreditCardInfo WHERE 
      full_name = ? AND 
      address = ? AND 
      city = ? AND 
      state = ? AND 
      zip_code = ? AND 
      card_name = ? AND 
      card_number = ? AND 
      exp_month = ? AND 
      exp_year = ? AND 
      cvv = ?
  `;

  try {
    // Execute the query using the pooled connection
    const [rows] = await pool.execute(query, [
      full_name,
      address,
      city,
      state,
      zip_code,
      card_name,
      card_number,
      exp_month,
      exp_year,
      cvv,
    ]);

    if (rows.length > 0) {
      console.log("CreditCard validation successful:", rows[0]);
      return res
        .status(200)
        .json({ status: "success", message: "Payment validation successful." });
    } else {
      console.log("CreditCard validation failed: No matching records found.");
      return res
        .status(404)
        .json({ status: "fail", message: "Payment details do not match any records." });
    }
  } catch (error) {
    console.error("Error validating payment:", error.message);
    return res
      .status(500)
      .json({ status: "error", message: `Database error occurred: ${error.message}` });
  }
});

// Export the router
module.exports = router;
