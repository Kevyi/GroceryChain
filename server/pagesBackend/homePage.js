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

module.exports = router