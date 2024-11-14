import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/shoppingCart.module.css";
import Cart from './Cart';

export default function ShoppingCartPage() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(savedCartItems);
    }, []);

    const handleRemoveItem = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    const handleQuantityChange = (productId, newQuantity) => {
        const updatedCart = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalWeight = cartItems.reduce((sum, item) => sum + (parseFloat(item.weight) || 0) * item.quantity, 0);
    const shippingFee = totalWeight < 20 ? 0 : 5.0;
    const finalPrice = totalPrice + shippingFee;

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
                                                onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                                className={styles.quantityButton}
                                            >-</button>
                                            <span className={styles.quantityDisplay}>{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className={styles.quantityButton}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.itemRight}>
                                    <p className={styles.itemBasePrice}>Base Price: ${item.price.toFixed(2)}</p>
                                    <p className={styles.itemTotalPrice}>Total Price: ${(item.price * item.quantity).toFixed(2)}</p>
                                    <p className={styles.itemBaseWeight}>Base Weight: {item.weight} lbs</p>
                                    <p className={styles.itemTotalWeight}>Total Weight: {(item.weight * item.quantity).toFixed(2)} lbs</p>
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
                    <p>Shipping Fee: {shippingFee === 0 ? "Free ($0.0)" : `$${shippingFee.toFixed(2)}`}</p>
                    <p><strong>Final Price: ${finalPrice.toFixed(2)}</strong></p>
                    
                    <div className={styles.buttonContainer}>
                        <button className={styles.payNowButton}>Pay NOW!</button>
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
        </div>
    );
}
