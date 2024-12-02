import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/success.module.css";
import ReceiptModal from "./ReceiptModal"; // Import the ReceiptModal component

export default function SuccessModal({ isOpen, receiptDetails, onClose }) {
    const navigate = useNavigate();
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false); // State to manage receipt modal visibility

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
                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.continueShoppingButton}
                            onClick={() => {
                                onClose(); // Close the success modal
                                navigate("/grocery-page"); // Navigate to the grocery page
                            }}
                        >
                            Continue Shopping 🛒
                        </button>
                        <button
                            className={styles.viewReceiptButton}
                            onClick={() => setIsReceiptModalOpen(true)} // Open receipt modal
                        >
                            View Receipt 📜
                        </button>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            <ReceiptModal
                isOpen={isReceiptModalOpen}
                onClose={() => setIsReceiptModalOpen(false)} // Close receipt modal
                receiptDetails={receiptDetails} // Pass receipt details as props
            />
        </div>
    );
}
