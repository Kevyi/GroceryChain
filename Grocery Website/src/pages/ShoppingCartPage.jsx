import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/shoppingCart.module.css";
import Cart from "./Cart";
import PaymentModal from "./Modal";
import SuccessModal from "./SuccesModal";
import ReceiptModal from "./ReceiptModal";

export default function ShoppingCartPage({ updateCartCount, loggedInUser }) {
    const [cartItems, setCartItems] = useState([]);
    const [purchaseStatus, setPurchaseStatus] = useState(null);
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [receiptDetails, setReceiptDetails] = useState(null); // Receipt details state

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchStockData = async () => {
            const alertedItems = new Set(); // Track items that have already triggered an alert
    
            try {
                // Fetch product data from the database
                const response = await fetch("http://localhost:3000/storage");
                const data = await response.json();
    
                if (data.status === "success") {
                    const stockData = data.data; // Array of products with stock info
    
                    // Get saved cart items from localStorage
                    const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    
                    // Validate saved cart items against database stock
                    const validatedItems = savedCartItems.map((item) => {
                        const productStock = stockData.find((product) => product.product_id === item.id);
    
                        if (!productStock) {
                            console.warn(`Product with ID ${item.id} not found in the database.`);
                            return null; // Exclude items not found in the database
                        }
    
                        if (item.quantity > productStock.quantity) {
                            if (!alertedItems.has(item.id)) {
                                // Alert only once per item
                                alert(
                                    `The quantity of ${productStock.product_name} has been adjusted to the available stock of ${productStock.quantity}.`
                                );
                                alertedItems.add(item.id); // Mark this item as alerted
                            }
                            return {
                                ...item,
                                quantity: productStock.quantity,
                                name: productStock.product_name, // Correctly link the product name
                            };
                        }
    
                        return {
                            ...item,
                            name: productStock.product_name, // Ensure name is added
                        };
                    }).filter(Boolean); // Remove null values (items not found in the database)
    
                    console.log("Loaded and validated cart items:", validatedItems);
    
                    // Update cart state, summary, and count
                    setCartItems(validatedItems); // Update cart items state
                    updateCartCount(validatedItems.length); // Update cart count badge
                    updateCartSummary(validatedItems); // Update summary (price, quantity, weight, etc.)
    
                    // Save validated items back to localStorage
                    localStorage.setItem("cartItems", JSON.stringify(validatedItems));
                } else {
                    console.error("Failed to fetch product data from the database.");
                }
            } catch (error) {
                console.error("Error fetching stock data:", error.message);
            }
        };
    
        fetchStockData();
    
        if (location.state && location.state.success) {
            setPurchaseStatus("Purchase successful!");
        }
    }, [location.state]);
    
    
    
    const saveCartItems = (items) => {
        setCartItems(items);
        localStorage.setItem("cartItems", JSON.stringify(items));
        updateCartCount(items.length);
        updateCartSummary(items);
    };
    
    const handleRemoveItem = (productId) => {
        const updatedCart = cartItems.filter((item) => item.id !== productId);
    
        console.log(`Removing item with ID ${productId}. Updated cart:`, updatedCart);
    
        saveCartItems(updatedCart);
    };
    
    const handleQuantityChange = async (productId, newQuantity) => {
        const product = cartItems.find((item) => item.id === productId);
    
        if (!product) {
            console.error(`Product with ID ${productId} not found.`);
            return;
        }
    
        try {
            // Fetch the product's stock from the database
            const response = await fetch("http://localhost:3000/storage");
            const data = await response.json();
    
            if (data.status === "success") {
                const productStock = data.data.find((product) => product.product_id === productId);
    
                if (!productStock) {
                    alert(`Product not found in the database.`);
                    return;
                }
    
                // Validate the new quantity
                if (newQuantity > productStock.quantity) {
                    alert(`You cannot add more than ${productStock.quantity} items for ${product.title}.`);
                    return;
                }
    
                if (newQuantity < 0) {
                    alert("Quantity cannot be negative.");
                    return;
                }
    
                console.log(`Updating quantity for ${product.name}:`, newQuantity);
    
                const updatedCart = cartItems.map((item) =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                );
    
                saveCartItems(updatedCart);
            } else {
                console.error("Failed to fetch product data from the database.");
            }
        } catch (error) {
            console.error("Error fetching stock data:", error.message);
        }
    };
    

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

    const handlePayment = async (paymentDetails) => {
        if (!loggedInUser) {
            setPurchaseStatus("Error: Please log in to proceed with the payment.");
            return false;
        }
    
        if (cartItems.length === 0) {
            setPurchaseStatus("Error: Your cart is empty.");
            return false;
        }
    
        try {
            // Step 1: Validate Credit Card
            const creditCardResponse = await fetch("http://localhost:3000/creditcard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: paymentDetails.name,
                    address: paymentDetails.address,
                    city: paymentDetails.city,
                    state: paymentDetails.state,
                    zip_code: paymentDetails.zipcode,
                    card_name: paymentDetails.cardName,
                    card_number: paymentDetails.cardNumber,
                    exp_month: paymentDetails.expMonth,
                    exp_year: paymentDetails.expYear,
                    cvv: paymentDetails.cvv,
                }),
            });
    
            const creditCardData = await creditCardResponse.json();
            if (creditCardData.status !== "success") {
                setPurchaseStatus(`Error: ${creditCardData.message}`);
                return false;
            }
    
            // Step 2: Process Purchase
            const cartData = cartItems.map((item) => ({
                id: item.id,
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                weight: item.weight,
            }));
    
            const purchaseResponse = await fetch("http://localhost:3000/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cartItems: cartData,
                    paymentDetails: {
                        full_name: paymentDetails.name,
                        address: paymentDetails.address,
                        city: paymentDetails.city,
                        state: paymentDetails.state,
                        zip_code: paymentDetails.zipcode,
                        card_name: paymentDetails.cardName,
                        card_number: paymentDetails.cardNumber,
                        exp_month: paymentDetails.expMonth,
                        exp_year: paymentDetails.expYear,
                        cvv: paymentDetails.cvv,
                    },
                }),
            });
    
            const purchaseData = await purchaseResponse.json();
            if (purchaseData.status === "success") {
                const username = loggedInUser?.username || JSON.parse(localStorage.getItem("loggedInUser"))?.username || "Guest";
                const userHistoryKey = `history_${username}`;
                const existingHistory = JSON.parse(localStorage.getItem(userHistoryKey)) || [];
    
                // Add the new purchase to the history
                const newPurchase = {
                    date: new Date().toLocaleString(),
                    items: cartData,
                    totalPrice,
                    shippingFee,
                    finalPrice,
                };
    
                const updatedHistory = [...existingHistory, newPurchase];
                localStorage.setItem(userHistoryKey, JSON.stringify(updatedHistory));
    
                // Update popular items tracker
                const popularItemsKey = "popularItems";
                const existingPopularItems = JSON.parse(localStorage.getItem(popularItemsKey)) || {};
    
                cartData.forEach((item) => {
                    existingPopularItems[item.title] = (existingPopularItems[item.title] || 0) + item.quantity;
                });
    
                localStorage.setItem(popularItemsKey, JSON.stringify(existingPopularItems));
    
                setPurchaseStatus("Purchase successful! 🎉");
                setReceiptDetails({
                    items: cartItems,
                    totalWeight,
                    totalPrice,
                    shippingFee,
                    finalPrice,
                });
                localStorage.removeItem("cartItems");
                setCartItems([]);
                updateCartCount(0);
                setIsModalOpen(false);
                setIsSuccessModalOpen(true);
                return true;
            } else {
                setPurchaseStatus(`Error: ${purchaseData.message}`);
                return false;
            }
        } catch (error) {
            setPurchaseStatus("Error: Unable to process your request. Please try again later.");
            return false;
        }
    };
    
    
   
    return (
        <div className={styles.cartContainer}>
            <div className={styles.cartItemsContainer}>
                <h2>Your Shopping Cart</h2>
                {cartItems.length > 0 ? (
                    <div className={styles.cartItems}>
                        {cartItems.map((item) => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.itemLeft}>
                                    <div className={styles.imageContainer}>
                                        <img src={item.image} alt={item.title} className={styles.itemImage} />
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <h3 className={styles.itemName}>{item.title}</h3>
                                        <div className={styles.quantityControl}>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(item.id, Math.max(1, item.quantity - 1))
                                                }
                                                className={styles.quantityButton}
                                            >
                                                -
                                            </button>
                                            <span className={styles.quantityDisplay}>{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className={styles.quantityButton}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.itemRight}>
                                    <p className={styles.itemBasePrice}>Base Price: ${item.price.toFixed(2)}</p>
                                    <p className={styles.itemTotalPrice}>
                                        Total Price: ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <p className={styles.itemBaseWeight}>Base Weight: {item.weight} lbs</p>
                                    <p className={styles.itemTotalWeight}>
                                        Total Weight: {(item.weight * item.quantity).toFixed(2)} lbs
                                    </p>
                                </div>
                                <button onClick={() => handleRemoveItem(item.id)} className={styles.removeButton}>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyCartContainer}>
                        <img src={Cart[0].image} alt="Empty Cart" className={styles.emptyCartImage} />
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
                    <p className={styles.shippingNote}>* Orders over 20 lbs incur a $5 shipping fee.</p>
                    <p>Total Items: {totalQuantity}</p>
                    <p>Total Weight: {totalWeight.toFixed(2)} lbs</p>
                    <p>Total Price: ${totalPrice.toFixed(2)}</p>
                    <p>
                        Shipping Fee: {shippingFee === 0 ? "Free ($0.0)" : `$${shippingFee.toFixed(2)}`}
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
                                    setShowLoginMessage(true);
                                } else {
                                    setIsModalOpen(true);
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
            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                handlePayment={handlePayment}
            />
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                onShowReceipt={() => setIsReceiptModalOpen(true)} // Pass function to open receipt
                receiptDetails={receiptDetails} // Pass receipt details to SuccessModal
            />
            <ReceiptModal
                isOpen={isReceiptModalOpen}
                onClose={() => setIsReceiptModalOpen(false)}
                receiptDetails={receiptDetails}
            />
        </div>
    );
}
