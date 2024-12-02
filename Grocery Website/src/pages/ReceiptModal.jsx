import React from "react";
import styles from "../styles/receiptModal.module.css";

export default function ReceiptModal({ isOpen, onClose, receiptDetails }) {
    if (!isOpen) return null;

    // Provide default values in case receiptDetails is undefined
    const {
        items = [],
        totalWeight = 0,
        totalPrice = 0,
        shippingFee = 0,
        finalPrice = 0,
    } = receiptDetails || {};

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Receipt</h2>
                <table className={styles.receiptTable}>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.title}</td>
                                <td>{item.quantity}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.summary}>
                    <p>Total Weight: {totalWeight.toFixed(2)} lbs</p>
                    <p>Total Price: ${totalPrice.toFixed(2)}</p>
                    <p>Shipping Fee: ${shippingFee.toFixed(2)}</p>
                    <p>
                        <strong>Final Price: ${finalPrice.toFixed(2)}</strong>
                    </p>
                </div>
                <button className={styles.closeButton} onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}
