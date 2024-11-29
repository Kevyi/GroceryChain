import React, { useState } from "react";
import styles from "../styles/modal.module.css";
import PaymentPage from "./Payment";

export default function PaymentModal({ isOpen, onClose, handlePayment }) {
    const [paymentStatus, setPaymentStatus] = useState("");
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

    const onPaymentSuccess = () => {
        setIsPaymentSuccessful(true);
        setPaymentStatus("Payment Successful! 🎉");
        setTimeout(() => {
            setPaymentStatus("");
            onClose(); // Close the modal
        }, 2000);
    };

    const onPaymentError = (errorMessage) => {
        setIsPaymentSuccessful(false);
        setPaymentStatus(errorMessage);
    };

    if (!isOpen) return null; // Ensure modal only renders when open

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    ✖
                </button>
                {isPaymentSuccessful ? (
                    <div className={styles.successContainer}>
                        <h2>🎉 Thank you for your purchase! 🎉</h2>
                        <p>Your cart is happy, and so are we! 😊</p>
                        <button
                            className={styles.continueShoppingButton}
                            onClick={onClose} // Close and redirect to grocery page
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <PaymentPage
                        handlePayment={async (paymentDetails) => {
                            setPaymentStatus("Processing payment...");
                            const success = await handlePayment(paymentDetails);
                            if (success) {
                                onPaymentSuccess();
                            } else {
                                onPaymentError("Payment Failed. Please try again.");
                            }
                        }}
                        onClose={onClose} // Pass the onClose function to PaymentPage
                        onPaymentSuccess={onPaymentSuccess}
                    />
                )}
                {paymentStatus && (
                    <p
                        className={
                            paymentStatus.includes("successful")
                                ? styles.successMessage
                                : styles.errorMessage
                        }
                    >
                        {paymentStatus}
                    </p>
                )}
            </div>
        </div>
    );
}
