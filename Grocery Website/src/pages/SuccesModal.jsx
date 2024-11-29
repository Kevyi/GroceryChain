import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/success.module.css";

export default function SuccessModal({ isOpen }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className={styles.fullPageOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.successContainer}>
                    <img
                        src="/EmptyCart/HappyCart.jpg" // Replace with actual path
                        alt="Happy Cart"
                        className={styles.successImage}
                    />
                    <h2 className={styles.successTitle}>🎉 Thank you for your purchase! 🎉</h2>
                    <p className={styles.successSubMessage}>
                        Your cart is happy, and so are we! 😊
                    </p>
                    <button
                        className={`${styles.continueShoppingButton} ${styles.success}`}
                        onClick={() => navigate("/grocery-page")}
                    >
                        Continue Shopping 🛒
                    </button>
                </div>
            </div>
        </div>
    );
}
