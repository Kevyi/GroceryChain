import styles from "./componentsStyle/navbar.module.css"
import logo from "../assets/react.svg"
import { FaShoppingCart } from "react-icons/fa"
import { BiFoodMenu } from "react-icons/bi";
import { IoIosLogIn } from "react-icons/io";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaBars } from "react-icons/fa6";

export default function NavbarTop(){
    return (

        <>
    <nav class={styles["navbar"]}>
      <div>
        <a href="/home">
          <GiForkKnifeSpoon class = {styles["logo"]}/>
        </a>
      </div>

      <div class={styles["menu"]}>
        <div class={styles["menu-links"]}>

          {/* {styles["test1"] + " "+ styles["test2"]} or {`${styles["test1"]} ${styles["test2"]}`}*/}
          

          <a href="/grocery-page">
            <FaBars />
            <div>Shop</div>
          </a>
          <a href="/shopping-cart">
            <FaShoppingCart />
            <div>Shopping Cart</div>
          </a>
        </div>

        <button class={styles["log-in"]}>
          <a href = "/login-page">
            <IoIosLogIn />
            <div>Login</div>
          </a>
        </button>

      </div>
  </nav>
        </>

    )
}