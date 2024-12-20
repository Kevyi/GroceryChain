//Imports Framework
const express = require("express");
//Calls the express() function or basically constructor and makes instance of express().
const app = express();
const cors = require("cors");
const db = require('./database.js');



//Learn about middleware.


// Import routes from different files
const groceryRoute = require("./pagesBackend/groceryPage.js");
const homeRoute = require("./pagesBackend/homePage.js");
const registerLoginRoute = require("./pagesBackend/registerLoginPage.js");
const shoppingCartRoute = require("./pagesBackend/shoppingCartPage.js");

app.use("/home", homeRoute);
app.use("/grocery-page", groceryRoute);
app.use("/shopping-cart", shoppingCartRoute);
// app.use("/register-login", registerLoginRoute);


//Listens to requires made from this website (origin). Not sure if we have to specify extended url like localhost:5173/groceryItems.
                    //Make different JS files and import it to this main server if possible.
                        //Parameters would take app (our express instance) and maybe cors (but you can define it in individual files).
                        //Use express.js --> router feature to do this. Node.js require/import features. ESX modules and something else.

const corsOptions = {
  origin: "http://localhost:5173",  // Allow your frontend domain
//   methods: ["GET", "POST"],  // Methods you want to allow
};

app.use(express.json());
app.use(cors(corsOptions));

//Backend is Express
//cors is how you select the backend (server response). The backend API.
    //Interacts with axios (http) for front-end to receive information.


    //Back-End has a response that "res/responsd" with a json file. 
        //Responds on port 8080 and with "/url" --> look at React APP to see.
app.get("/api", (req, res) => {
    res.json({random: ["test1, test2"]})
});







// app.get("/shopping-cart/groceryItems", (req, res) => {
//     res.json({ message: 'Grocery items added successfully!' });
//   });











app.listen(8080, () => {
    console.log("server started");
});


