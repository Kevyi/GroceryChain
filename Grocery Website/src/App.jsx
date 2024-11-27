import { useState, useEffect,createContext } from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import axios from 'axios';
import GroceryPage from './pages/GroceryPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ShoppingCartPage from './pages/ShoppingCartPage.jsx'
import RegisterLoginPage from './pages/LoginPage.jsx'
import TestingPage1 from './pages/TestingPage1.jsx'
import NavbarTop from './components/NavbarTop.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AccountPage from './pages/AccountPage.jsx'

//Creates a login context for all child components
export const LoginContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
        {/*Creates set routes/pages for people to go to*/}
      {/* <NavbarTop></NavbarTop> */}
      <Router>
          <LoginContext.Provider value = {{isLoggedIn, setIsLoggedIn}}> 
            <NavbarTop></NavbarTop>
            <Routes>
              <Route index element = {<HomePage></HomePage>}></Route> 
              <Route path = "/home" element = {<HomePage/>}></Route>
              <Route path = "/grocery-page" element = {<GroceryPage/>}></Route>
              <Route path = "/shopping-cart" element = {<ShoppingCartPage/>}></Route>
              <Route path = "/register-login" element = {<RegisterLoginPage/>}></Route>

              {/* Insert protected route for account page and for admin page. */}
              <Route path = "/testing1" element = {<TestingPage1/>}></Route>
              <Route path = "/login-page" element = {<LoginPage/>}></Route>
              <Route path = "/account-page" element = {<AccountPage/>}></Route>
            </Routes>
            
          </LoginContext.Provider>
          
      </Router>
    </>
  )
}

export default App
