import styles from "../styles/shoppingCart.module.css"
import CartItem from "../components/CartItem.jsx"

export default function ShoppingCartPage(){

    //Get dictionary of objects that's formatted like "name: amount". Seen in popUp component.
    const items = JSON.parse(localStorage.getItem('items'));

    //use this item to map it below for cartItems. Cartitems will need to be updated to 
        //take in new arguments.

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