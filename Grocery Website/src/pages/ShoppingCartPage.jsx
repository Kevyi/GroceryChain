import styles from "../styles/shoppingCart.module.css"
import CartItem from "../components/CartItem.jsx"

export default function ShoppingCartPage(){
    return (
        
        <>
        {/*Most backend oriented part*/}
            <div id = {styles["main"]}>

                <div className = {styles["item-display"]}>
                    {/*Input component that lists everything from top to bottom. Add remove butotn etc. */}
                    <CartItem></CartItem>
                    <CartItem></CartItem>
                    <CartItem></CartItem>
                    <CartItem></CartItem>
                </div>

                <div className = {styles["cart"]}>
                    {/* Display the prices and stuff.*/}
                    Include the receipt etc.
                </div>

            </div>
        
        </>

    )
}