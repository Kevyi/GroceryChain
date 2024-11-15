const express = require("express");
const router = express.Router();
const db = require('../database.js');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'grocery_store' // Ensure this matches your database name in XAMPP
});

// GET all products
router.get("/", (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Convert the `categories` field from JSON string to JSON object for each product
        const products = results.map(product => ({
            ...product,
            categories: JSON.parse(product.categories) // Parse categories JSON
        }));

        res.json(products);
    });
});

// POST a new product
router.post("/", (req, res) => {
    const { name, description, price, stock, weight, categories } = req.body;

    // Check if all required fields are provided
    if (!name || price == null || stock == null) {
        return res.status(400).json({ error: "Name, price, and stock are required fields." });
    }

    // Insert new product into the database
    const sql = "INSERT INTO products (name, description, price, stock, weight, categories) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [
        name,
        description,
        price,
        stock,
        weight,
        JSON.stringify(categories)  // Store categories as a JSON string
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Product added successfully!', productId: result.insertId });
    });
});
//user router.get() instead of app.get().

module.exports = router