const express = require("express");
const router = express.Router();
const db = require('../database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST route to register a new user
router.post("/register", async (req, res) => {

    //FrontEnd must posts name, email, password.
    const { name, email, password } = req.body;

    // Check if user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';

    db.getConnection((error, connection) => {
        if (error) {
          console.error('Error connecting to MySQL database:', error);
        } else {
          console.log('Connected to MySQL database!');
    
          try{
            
            db.query(checkUserQuery, [email], async (err, result) => {
    
 
                if (result.length > 0) return res.status(400).json({ error: 'User already exists' });
        
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
        
                // Insert the new user into the database
                const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
                db.query(sql, [name, email, hashedPassword], (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ message: 'User registered successfully!' });
                });
                //Closes the connection.
                connection.release();
            });
    
          }catch(err){
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: err.message });
          }
        }
      });
});


// POST route to login a user
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    const getUserQuery = 'SELECT * FROM users WHERE email = ?';

    db.getConnection((error, connection) => {
        if (error) {
          console.error('Error connecting to MySQL database:', error);
        } else {
          console.log('Connected to MySQL database!');
    
          try{
            
            db.query(getUserQuery, [email], async (err, result) => {

                //Closes connection
                connection.release();
                if (err) return res.status(500).json({ error: err.message });
                if (result.length === 0) return res.status(400).json({ error: 'User does not exist' });
        
                //Get FIRST object within array result.
                const user = result[0];
        
                // Compare passwords
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) return res.status(400).json({ error: 'Invalid password' });
        
                // Generate JWT token (optional)
                const token = jwt.sign({ userId: user.id, email: user.email }, 'secretkey', { expiresIn: '1h' });
        
                res.json({
                    message: 'Login successful',
                    token: token,
                    user: { id: user.id, name: user.name, email: user.email }
                });
            });
    
          }catch(err){
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: err.message });
          }
        }
      });
});

//user router.get() instead of app.get().

module.exports = router