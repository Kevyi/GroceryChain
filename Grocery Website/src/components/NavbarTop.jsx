import styles from "../styles/navbar.module.css"
import logo from "../assets/react.svg"

export default function NavbarTop(){
    return (

        <>
    <nav class={styles["navbar"]}>
      <div>
        <a href="/home">
          <img src = {logo}></img>
        </a>
      </div>

      <div class={styles["menu"]}>
        <div class={styles["menu-links"]}>

          {/* {styles["test1"] + " "+ styles["test2"]} or {`${styles["test1"]} ${styles["test2"]}`}*/}
          

          <a href="/grocery-page">
            <img src = {logo}></img>
              Grocery Items
          </a>
          <a href="/shopping-cart">
            <img src = {logo}></img>
              Shopping Cart
          </a>
            <p>Test text</p>
        </div>

        <button class={styles["log-in"]}>
          <a href = "/register-login">Log In</a>
        </button>

      </div>

      
  </nav>
        </>

    )
}