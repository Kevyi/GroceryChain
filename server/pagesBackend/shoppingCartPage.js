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



router.post("/groceryItems", (req, res) => {

    
  // Step 1: Retrieve existing user data
  const {item} = req.body;

  const getUserQuery = 'SELECT * FROM products WHERE name = ?';

 

      db.query(getUserQuery, item, (err, results) => {

          if (err) return res.status(500).send('Error retrieving user data');
          if (results.length === 0) {
              
              return res.status(404).send('Item not found');
          }

          console.log({results})
          return res.json({results});
  
      })
     

      

  });


// router.post("/groceryItems", (req, res) => {
//   const item = req.body;
//   res.json({ message: req.body });
// });





module.exports = router