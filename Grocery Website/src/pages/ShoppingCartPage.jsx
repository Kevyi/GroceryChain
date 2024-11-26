import styles from "../styles/shoppingCart.module.css"
import CartItem from "../components/CartItem.jsx"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ShoppingCartPage(){

    //Get dictionary of objects that's formatted like "name: amount". Seen in popUp component.


    const items = JSON.parse(localStorage.getItem('cartItems'));


    
    //use this item to map it below for cartItems. Cartitems will need to be updated to 
        //take in new arguments.

    // const [cartItems, setCartItems] = useState([]);
    // const [purchaseStatus, setPurchaseStatus] = useState(null); // To track the status of the purchase
    // const navigate = useNavigate();

    // // Calculate cart totals
    // const [totalQuantity, setTotalQuantity] = useState(0);
    // const [totalPrice, setTotalPrice] = useState(0);
    // const [totalWeight, setTotalWeight] = useState(0);
    // const [shippingFee, setShippingFee] = useState(0);
    // const [finalPrice, setFinalPrice] = useState(0);

    // useEffect(() => {
    //     const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    //     setCartItems(savedCartItems);
    //     updateCartSummary(savedCartItems);
    // }, []);

    // // Function to update the localStorage and cart item count in Navbar
    // const saveCartItems = (items) => {
    //     setCartItems(items);
    //     localStorage.setItem('cartItems', JSON.stringify(items));
    //     updateCartCount();
    //     updateCartSummary(items);
    // };

    // // Function to remove item from cart in navbar?
    // const handleRemoveItem = (productId) => {
    //     const updatedCart = cartItems.filter(item => item.id !== productId);
    //     saveCartItems(updatedCart);
    // };

    // // Function to handle quantity changes
    // const handleQuantityChange = (productId, newQuantity) => {
    //     const updatedCart = cartItems.map(item =>
    //         item.id === productId ? { ...item, quantity: newQuantity } : item
    //     );
    //     saveCartItems(updatedCart);
    // };

    // const updateCartSummary = (items) => {
    //     const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    //     const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    //     const totalWeight = items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0) * item.quantity, 0);
    //     const shippingFee = totalWeight <= 20 ? 0 : 5.0;
    //     const finalPrice = totalPrice + shippingFee;

    //     setTotalQuantity(totalQty);
    //     setTotalPrice(totalPrice);
    //     setTotalWeight(totalWeight);
    //     setShippingFee(shippingFee);
    //     setFinalPrice(finalPrice);
    // };

    // const handlePayment = async () => {
    //     if (cartItems.length === 0) {
    //         setPurchaseStatus("Error: Your cart is empty.");
    //         return;
    //     }
    
    //     const cartData = cartItems.map(item => ({
    //         id: item.id,
    //         quantity: item.quantity,
    //     }));
    
    //     console.log("Sending cart data to backend:", cartData);
    


    //     //Can't surpass the amount in stock right now.
    //     try {
    //         const response = await fetch("http://localhost/Purchase.php", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ cartItems: cartData }),
    //         });
    
    //         console.log("Server Response Status:", response.status);
    
    //         if (!response.ok) {
    //             throw new Error("Failed to connect to the server");
    //         }
    
    //         const data = await response.json();
    //         console.log("Response from backend:", data);
    
    //         if (data.status === "success") {
    //             setPurchaseStatus("Purchase successful!");
    //             localStorage.removeItem("cartItems");
    //             setCartItems([]);
    //             updateCartCount();
    //         } else {
    //             setPurchaseStatus("Error: " + data.message);
    //         }
    //     } catch (error) {
    //         console.error("Error:", error);
    //         setPurchaseStatus("Error: Unable to process your request. Please try again later.");
    //     }
    // };

    return (
        
        <>
        {/*Most backend oriented part*/}
            <div id = {styles["main"]}>

                <div className = {styles["item-display"]}>
                {items == null || Object.keys(items).length == 0? (<div>

                    Display something else, prob in replace of Main

                </div>) : 
                
                (Object.entries(items).map(([key, value]) => (
                    <CartItem
                    key={key}
                    groceryItem={key}
                    shopCount = {value}
                    />
                 ))
                )}
                    
                </div>

                <div className = {styles["cart"]}>
                    {/* Display the prices and stuff.*/}
                    Include the receipt etc.
                </div>

            </div>
        
        </>

    )
}