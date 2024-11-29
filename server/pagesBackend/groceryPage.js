const express = require("express");
const router = express.Router();
const db = require("../database.js");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from the frontend domain
};

router.use(express.json());
router.use(cors(corsOptions));

// Route to get grocery items with optional search and category filtering
router.get("/groceryItems", (req, res) => {
  const { query, categories } = req.query; // Extract query and categories from request

  // Base SQL query
  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];

  // Add search query filtering if provided
  if (query) {
    sql += " AND name LIKE ?";
    params.push(`%${query}%`); // Wildcards for partial matching
  }

  // Add category filtering if provided
  if (categories) {
    const categoryList = categories.split(","); // Convert categories to an array
    if (categoryList.length > 0) {
      // Use JSON_CONTAINS to match categories in the JSON array
      const categoryConditions = categoryList.map(() => "JSON_CONTAINS(categories, ?, '$')");
      sql += ` AND (${categoryConditions.join(" OR ")})`;
      params.push(...categoryList.map((cat) => `"${cat}"`)); // Add each category as a JSON string
    }
  }

  console.log("SQL Query:", sql); // Debugging: Log the final SQL query
  console.log("Params:", params); // Debugging: Log the query parameters

  // Execute the query
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Error retrieving products" });
    }

    return res.json({ results });
  });
});

module.exports = router;
