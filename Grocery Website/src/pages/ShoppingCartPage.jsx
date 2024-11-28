import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from "../styles/shoppingCart.module.css";
import Cart from './Cart';

export default function ShoppingCartPage({ updateCartCount, loggedInUser }) { // Accept loggedInUser as a prop
    const [cartItems, setCartItems] = useState([]);
    const [purchaseStatus, setPurchaseStatus] = useState(null); // To track the status of the purchase
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    

    useEffect(() => {
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(savedCartItems);
        updateCartSummary(savedCartItems);
        if (location.state && location.state.success) {
            handlePayment();
            setPurchaseStatus("Purchase successful!");

        }
    }, [location.state]);

    // Function to update the localStorage and cart item count in Navbar
    const saveCartItems = (items) => {
        setCartItems(items);
        localStorage.setItem('cartItems', JSON.stringify(items));
        updateCartCount();
        updateCartSummary(items);
    };

    // Function to remove item from cart
    const handleRemoveItem = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        saveCartItems(updatedCart);
    };

    // Function to handle quantity changes
    const handleQuantityChange = (productId, newQuantity) => {
        const updatedCart = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        saveCartItems(updatedCart);
    };

    // Calculate cart totals
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);

    const updateCartSummary = (items) => {
        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalWeight = items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0) * item.quantity, 0);
        const shippingFee = totalWeight <= 20 ? 0 : 5.0;
        const finalPrice = totalPrice + shippingFee;

        setTotalQuantity(totalQty);
        setTotalPrice(totalPrice);
        setTotalWeight(totalWeight);
        setShippingFee(shippingFee);
        setFinalPrice(finalPrice);
    };

    const handlePayment = async () => {
        if (!loggedInUser) {
            setPurchaseStatus("Error: Please log in to proceed with the payment.");
            return;
        }

        if (cartItems.length === 0) {
            setPurchaseStatus("Error: Your cart is empty.");
            return;
        }

        const cartData = cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
        }));

        console.log("Sending cart data to backend:", cartData);

        try {
            const response = await fetch("http://localhost/Purchase.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cartItems: cartData }),
            });

            console.log("Server Response Status:", response.status);

            if (!response.ok) {
                throw new Error("Failed to connect to the server");
            }

            const data = await response.json();
            console.log("Response from backend:", data);

            if (data.status === "success") {
                setPurchaseStatus("Purchase successful!");
                localStorage.removeItem("cartItems");
                setCartItems([]);
                updateCartCount();
            } else {
                setPurchaseStatus("Error: " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            setPurchaseStatus("Error: Unable to process your request. Please try again later.");
        }
    };

    return (
        <div className={styles.cartContainer}>
            {purchaseStatus && (
                <div
                    className={
                        purchaseStatus.startsWith("Error")
                            ? styles.errorMessage
                            : styles.successMessage
                    }
                >
                   
                </div>
            )}
          {purchaseStatus === "Purchase successful!" ? (
    // Success Message with Happy Cart
    <div className={styles.successContainer}>
        <div className={styles.successContent}>
            <img
                src={Cart[1].image} // Use the HappyCart image for success
                className={styles.successImage}
                alt="Happy Cart"
            />
            <h2 className={styles.successTitle}>🎉Thank you for your purchase!🎉</h2>
            <p className={styles.successSubMessage}>
                Your cart is happy, and so are we! 😊
            </p>
        </div>
        <button
            className={`${styles.continueShoppingButton} ${styles.success}`}
            onClick={() => navigate("/grocery-page")}
        >
            Continue Shopping 🛒
        </button>
    </div>


            ) : (
                <>
                    <div className={styles.cartItemsContainer}>
                        <h2>Your Shopping Cart</h2>

                        {cartItems.length > 0 ? (
                            <div className={styles.cartItems}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className={styles.cartItem}>
                                        <div className={styles.itemLeft}>
                                            <div className={styles.imageContainer}>
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className={styles.itemImage}
                                                />
                                            </div>
                                            <div className={styles.itemDetails}>
                                                <h3 className={styles.itemName}>{item.title}</h3>
                                                <div className={styles.quantityControl}>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.id,
                                                                Math.max(1, item.quantity - 1)
                                                            )
                                                        }
                                                        className={styles.quantityButton}
                                                    >
                                                        -
                                                    </button>
                                                    <span className={styles.quantityDisplay}>
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className={styles.quantityButton}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.itemRight}>
                                            <p className={styles.itemBasePrice}>
                                                Base Price: ${item.price.toFixed(2)}
                                            </p>
                                            <p className={styles.itemTotalPrice}>
                                                Total Price: ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <p className={styles.itemBaseWeight}>
                                                Base Weight: {item.weight} lbs
                                            </p>
                                            <p className={styles.itemTotalWeight}>
                                                Total Weight:{" "}
                                                {(item.weight * item.quantity).toFixed(2)} lbs
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className={styles.removeButton}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyCartContainer}>
                                <img
                                    src={Cart[0].image} // Use SadCart image when the cart is empty
                                    alt="Empty Cart"
                                    className={styles.emptyCartImage}
                                />
                                <p className={styles.emptyCartMessage}>Your cart is empty</p>
                                <p className={styles.sadMessage}>Add something to make me happy!!!</p>
                                <button
                                    className={styles.continueShoppingButton}
                                    onClick={() => navigate("/grocery-page")}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className={styles.cartSummaryContainer}>
                            <h3>Cart Summary</h3>
                            <p className={styles.shippingNote}>
                                * Orders over 20 lbs incur a $5 shipping fee.
                            </p>
                            <p>Total Items: {totalQuantity}</p>
                            <p>Total Weight: {totalWeight.toFixed(2)} lbs</p>
                            <p>Total Price: ${totalPrice.toFixed(2)}</p>
                            <p>
                                Shipping Fee:{" "}
                                {shippingFee === 0
                                    ? "Free ($0.0)"
                                    : `$${shippingFee.toFixed(2)}`}
                            </p>
                            <p>
                                <strong>Final Price: ${finalPrice.toFixed(2)}</strong>
                            </p>

                <div className={styles.buttonContainer}>
                                {!loggedInUser && showLoginMessage && (
                                    <p className={styles.loginPromptMessage}>
                                        Please log in to proceed with the payment.
                                    </p>
                                )}
                                <button
                                    className={styles.payNowButton}
                                    onClick={() => {
                                        if (!loggedInUser) {
                                            setShowLoginMessage(true); // Show message if user is not logged in
                                        } else {
            
                                            handlePayment(); // Proceed with payment if user is logged in
                                        }
                                    }}
                                    
                                >
                                    Pay NOW!
                                </button>
                                <span className={styles.orText}>OR</span>
                                <button
                                    className={styles.keepShoppingButton}
                                    onClick={() => navigate("/grocery-page")}
                                >
                                    Keep Shopping
                                </button>
                            </div>
                    </div>
                    )}
                </>
            )}
        </div>
    );
}
