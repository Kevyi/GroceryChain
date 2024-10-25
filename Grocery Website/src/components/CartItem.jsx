import styles from "./componentsStyle/cartItem.module.css"
import logo from "../assets/react.svg"

//Use items from localstorage to check for cart and compare with database.
    ///Calculate prices here etc.

        export default function CartItem(){
            return(<>

                <div id = {styles["id"]}> 
                    <div className = {styles["image"]}> <img src = {logo}></img></div>
                    <div className = {styles["details"]}>
                        <strong>This is the Name</strong>
                        <p>This is the description!!!</p>
                        <p>This is the quantity</p>
                        
                        <div className = {styles["buttons-div"]}>
                            <button>Submit</button>
                            <button>Delete</button>
                        </div>
                        
                    </div>
                    <p>Include Price on the right etc.</p>

                </div>
            </>)
        }