const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const router = express.Router();

// Middleware
router.use(cors());
router.use(express.json());

// Database connection configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "cmpe_131",
};

const pool = mysql.createPool(dbConfig);

// Route to verify storage route is active
router.get("/storage/active", (req, res) => {
  console.log("GET /storage/active - Storage route is active");
  res.json({ status: "success", message: "Storage route is active." });
});

// GET: Fetch all products
router.get("/storage", async (req, res) => {
  const query = `
    SELECT 
      id AS product_id, 
      Name AS product_name, 
      Count AS quantity, 
      Price AS price 
    FROM products
  `;

  try {
    const [rows] = await pool.query(query);

    // Add dynamic availability field
    const products = rows.map((row) => ({
      ...row,
      availability: row.quantity > 0 ? "In Stock" : "Out of Stock",
    }));

    res.status(200).json({ status: "success", data: products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ status: "error", message: "Failed to fetch product data." });
  }
});

// POST: Update product stock
router.post("/storage", async (req, res) => {
  const { product_id, quantity } = req.body;

  // Validate request body
  if (!product_id || quantity === undefined) {
    return res.status(400).json({ status: "error", message: "Missing product_id or quantity." });
  }

  try {
    // Fetch current stock
    const [productRows] = await pool.query("SELECT Count FROM products WHERE id = ?", [product_id]);

    if (productRows.length === 0) {
      return res.status(404).json({ status: "error", message: "Product not found." });
    }

    const currentStock = productRows[0].Count;

    // Validate requested quantity
    if (quantity > currentStock) {
      return res.status(400).json({
        status: "error",
        message: `Requested quantity exceeds available stock. Available stock: ${currentStock}.`,
      });
    }

    // Update stock in the database
    const query = "UPDATE products SET Count = Count - ? WHERE id = ?";
    const [result] = await pool.query(query, [quantity, product_id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ status: "success", message: "Stock updated successfully." });
    } else {
      res.status(404).json({ status: "error", message: "Failed to update stock." });
    }
  } catch (error) {
    console.error("Error updating stock:", error.message);
    res.status(500).json({ status: "error", message: "Failed to update stock." });
  }
});

// Export the router
module.exports = router;
