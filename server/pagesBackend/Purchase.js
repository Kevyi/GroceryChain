const express = require("express");
const mysql = require("mysql2/promise");

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

// Simple GET route to verify the purchase route is active
router.get("/purchase", (req, res) => {
  console.log("GET /purchase - Purchase route is active");
  res.send("Purchase route is active. Use POST to submit purchase details.");
});

// POST: Purchase endpoint
router.post("/purchase", async (req, res) => {
  const { cartItems } = req.body;

  // Validate incoming data
  if (!cartItems || !Array.isArray(cartItems)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid cart items data. Provide a valid array of items.",
    });
  }

  const connection = await pool.getConnection();

  try {
    // Start a transaction
    await connection.beginTransaction();

    for (const item of cartItems) {
      const { id: productId, quantity: quantityPurchased } = item;

      console.log(`Processing Item: ID = ${productId}, Quantity = ${quantityPurchased}`);

      // Fetch current stock for the product
      const [rows] = await connection.query(
        "SELECT Count FROM products WHERE id = ?",
        [productId]
      );

      if (rows.length === 0) {
        throw new Error(`Product not found with ID: ${productId}`);
      }

      const currentStock = rows[0].Count;

      console.log(`Stock for Product ID ${productId}: ${currentStock}`);

      // Validate stock availability
      if (currentStock < quantityPurchased) {
        throw new Error(
          `Insufficient stock for Product ID: ${productId}. Available: ${currentStock}, Requested: ${quantityPurchased}`
        );
      }

      // Update inventory in the database
      await connection.query(
        "UPDATE products SET Count = Count - ? WHERE id = ?",
        [quantityPurchased, productId]
      );

      console.log(
        `Successfully updated Product ID ${productId}: Decreased by ${quantityPurchased}`
      );
    }

    // Commit the transaction
    await connection.commit();
    console.log("Transaction committed successfully.");
    res.status(200).json({ status: "success", message: "Purchase successful." });
  } catch (error) {
    // Rollback transaction on failure
    await connection.rollback();
    console.error("Transaction rolled back. Error:", error.message);
    res.status(500).json({
      status: "error",
      message: `Error processing purchase: ${error.message}`,
    });
  } finally {
    // Release the database connection
    connection.release();
    console.log("Connection released.");
  }
});

// Export the router
module.exports = router;
