const express = require("express");
const router = express.Router();
const mysql = require('mysq12');
// Assuming DB is exported from server.js, or recreate connection here.
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'grocery_store'
});

router.get("/", (req, res) => {
    const sql = "SELECT * FROM grocery_items"; // Adjust this table name to your schema
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


//user router.get() instead of app.get().