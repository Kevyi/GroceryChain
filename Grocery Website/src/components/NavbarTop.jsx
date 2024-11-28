import styles from "./componentsStyle/navbar.module.css"
import logo from "../assets/react.svg"
import { FaShoppingCart } from "react-icons/fa"
import { BiFoodMenu } from "react-icons/bi";
import { IoIosLogIn } from "react-icons/io";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaBars } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { useState, useEffect, useContext  } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {LoginContext} from "../App.jsx"



export default function NavbarTop(){


  //Gets the LoggedIn State from App.jsx, imported
  const {isLoggedIn, setIsLoggedIn} = useContext(LoginContext);
  
  let user;
  const navigate = useNavigate();

  function isUserLoggedIn() {

    const getToken = async () => {
      const token = localStorage.getItem('token');

      //Means the user is logged out.
      if(token == "No token")return;

      try{
        //This post is in the server.js
        const response = await fetch('http://localhost:8080/verifying-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({token: token}),
        })
        
        const data = await response.json();

        
        //data contains: userId: user.id, name : user.name, email: user.email, password : user.password, isAdmin : user.isAdmin}
          //AND transactions.receipts = returns an array of items we bought. Will hold objects within array.
            //Transaction should be populated after person purchases and appends to receipt.
        if(!isLoggedIn){
          user = data;
          // console.log(user)
          setIsLoggedIn(true);
          navigate("/home");
        }
        
      }
      catch(error){
        console.log(error)
        setIsLoggedIn();
      }
        
    };
  
    getToken();
    
  }

  const handleLogout = () => {
    localStorage.setItem('token', 'No token')
    setIsLoggedIn(false);
    navigate("/home")
    
  };

  useEffect(() => {
    isUserLoggedIn()
  }, [isLoggedIn]); // Only re-run the effect if loggedIn changes


    return (

    <>
    <nav class={styles["navbar"]}>
      <div>
        <Link to="/home">
          <GiForkKnifeSpoon class = {styles["logo"]}/>
        </Link>
      </div>

      <form class ={styles["search"]}>
        
        <input 
          form 
          class={styles["field"]} 
          placeholder = "Search Freshie">
        </input>

        <button type="submit">
          <FaSearch class={styles["search-icon"]}/>
        </button>
      </form>

      <div class={styles["menu"]}>
        <div class={styles["menu-links"]}>
          <Link to="/grocery-page">
            <FaBars />
            <div>Shop</div>
          </Link>

          <Link to="/shopping-cart">
            <FaShoppingCart />
            <div>Shopping Cart</div>
          </Link>

          {isLoggedIn ? (
            <>
            <Link to = "/account-page">
              <IoPerson />
            </Link>
            <button onClick = {handleLogout}>Log Out</button>
            </>
            
          ) : (
            <>
            <Link to = "/login-page">
              <IoPerson />
              <div>Sign In / Register</div>
            </Link>
          </>

          )}
          
        </div>
      </div>
    </nav>
    </>

    )
}