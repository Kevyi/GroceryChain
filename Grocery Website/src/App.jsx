import { useState, useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import axios from 'axios';
import GroceryPage from './pages/GroceryPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ShoppingCartPage from './pages/ShoppingCartPage.jsx'
import RegisterLoginPage from './pages/RegisterLoginPage.jsx'
import TestingPage1 from './pages/TestingPage1.jsx'

function App() {
  const [count, setCount] = useState(0)

  //On input with argument (), activate arrow function.
    //async means asynchronously, so will do it in the meantime despite other processes.

 
  const fetchAPI = async () => {
      //Gets data from /api which is found in server backend
      const response = await axios.get("http://localhost:8080/api");

      //Prints out received response. Can make a try/except to make sure response is heard?
      console.log(response.data.random);
  };

  //Call function on intial render of webpage
    useEffect(() => {
      fetchAPI()
    }, []);

    //Something to note, is that React has a specialized router that routes to different webpages.
      



  return (
    <>
        {/*Creates set routes/pages for people to go to*/}
      
      <Router>
          <Routes>
            <Route index element = {<HomePage></HomePage>}></Route> 
            <Route path = "/home" element = {<HomePage/>}></Route>
            <Route path = "/grocery-page" element = {<GroceryPage/>}></Route>
            <Route path = "/shopping-cart" element = {<ShoppingCartPage/>}></Route>
            <Route path = "/register-login" element = {<RegisterLoginPage/>}></Route>
            <Route path = "/testing1" element = {<TestingPage1/>}></Route>
          </Routes>
      </Router>
    </>
  )
}

export default App
