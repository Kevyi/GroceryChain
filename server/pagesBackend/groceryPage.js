const express = require("express");
const router = express.Router();
const db = require('../database.js');
const cors = require("cors");

//user router.get() instead of app.get().

const corsOptions = {
    origin: "http://localhost:5173",  // Allow your frontend domain
  //   methods: ["GET", "POST"],  // Methods you want to allow
  };
  
router.use(express.json());
router.use(cors(corsOptions));



//user router.get() instead of app.get().

router.get("/groceryItems", (req, res) => {

    
    // Step 1: Retrieve existing user data
    const getUserQuery = 'SELECT * FROM products';

   

        db.query(getUserQuery, (err, results) => {

            if (err) return res.status(500).send('Error retrieving user data');
            if (results.length === 0) {
                
                return res.status(404).send('Item not found');
            }

            console.log({results})
            return res.json({results});
    
        })
       

        

    });

module.exports = router