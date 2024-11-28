const express = require("express");
const router = express.Router();
const db = require('../database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require("cors");


const corsOptions = {
    origin: "http://localhost:5173",  // Allow your frontend domain
  //   methods: ["GET", "POST"],  // Methods you want to allow
  };
  
router.use(express.json());
router.use(cors(corsOptions));

//Get account details through server.js verifying-login which also returns the given data.

//user router.get() instead of app.get().

module.exports = router