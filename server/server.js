const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// Example: Default route for root path "/"
app.get("/", (req, res) => {
  res.send("Welcome to the Node.js Backend! The server is running.");
});

// Import routes
const loginRoute = require("./pagesBackend/Login"); // Adjust the path if needed
const registerRoute = require("./pagesBackend/Register");
const purchaseRoute = require("./pagesBackend/Purchase");
const storageRoute = require("./pagesBackend/Storage");
const creditcardRoute = require("./pagesBackend/CreditCard");
app.use("/", loginRoute); // Use the login route
app.use("/", registerRoute); // Use the register route
app.use("/", purchaseRoute); // Use the register route
app.use("/", storageRoute);
app.use("/", creditcardRoute);


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });