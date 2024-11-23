import styles from "./componentsStyle/navbar.module.css"
import logo from "../assets/react.svg"
import { FaShoppingCart } from "react-icons/fa"
import { BiFoodMenu } from "react-icons/bi";
import { IoIosLogIn } from "react-icons/io";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaBars } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

export default function NavbarTop(){
    return (

        <>
    <nav class={styles["navbar"]}>
      <div>
        <a href="/home">
          <GiForkKnifeSpoon class = {styles["logo"]}/>
        </a>
      </div>

      <form class ={styles["search"]}>
        <input form class={styles["field"]} placeholder = "Search Freshie"></input>
        <button type="submit"><FaSearch class={styles["search-icon"]}/></button>
      </form>

      <div class={styles["menu"]}>
        <div class={styles["menu-links"]}>
          <a href="/grocery-page">
            <FaBars />
            <div>Shop</div>
          </a>

          <a href="/shopping-cart">
            <FaShoppingCart />
            <div>Shopping Cart</div>
          </a>

          <a href = "/login-page">
            <IoPerson />
            <div>Sign In / Register</div>
          </a>
        </div>
      </div>
    </nav>
    </>

    )
}