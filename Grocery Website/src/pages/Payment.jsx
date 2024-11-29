import React, { useState } from "react";
import styles from "../styles/paymentPage.module.css";

export default function PaymentPage({ handlePayment, onClose, onPaymentSuccess }) {
    const [paymentDetails, setPaymentDetails] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
        cardName: "",
        cardNumber: "",
        expMonth: "",
        expYear: "",
        cvv: "",
    });

    const [paymentStatus, setPaymentStatus] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentStatus("Processing payment...");

        const success = await handlePayment(paymentDetails);

        if (success) {
            setPaymentStatus("Payment Successful! 🎉");
            setTimeout(() => {
                onPaymentSuccess(); // Trigger success handler
            }, 1500);
        } else {
            setPaymentStatus("Error: Unable to process payment.");
        }
    };

    return (
        <div className={styles.paymentPage}>
            <button className={styles.closeButton} onClick={onClose}>
                ✖
            </button>
            <form className={styles.paymentForm} onSubmit={handleSubmit}>
                <h1 className={styles.pageTitle}>Payment Page</h1>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <h3 className={styles.sectionTitle}>Billing Address</h3>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={paymentDetails.name}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={paymentDetails.address}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={paymentDetails.city}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                            <div className={styles.smallInputGroup}>
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={paymentDetails.state}
                                    onChange={handleInputChange}
                                    className={styles.smallInput}
                                />
                                <input
                                    type="text"
                                    name="zipcode"
                                    placeholder="Zip Code"
                                    value={paymentDetails.zipcode}
                                    onChange={handleInputChange}
                                    className={styles.smallInput}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <h3 className={styles.sectionTitle}>Payment Info</h3>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="cardName"
                                placeholder="Name on Card"
                                value={paymentDetails.cardName}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="Card Number"
                                value={paymentDetails.cardNumber}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                            <div className={styles.smallInputGroup}>
                                <input
                                    type="text"
                                    name="expMonth"
                                    placeholder="MM"
                                    value={paymentDetails.expMonth}
                                    onChange={handleInputChange}
                                    className={styles.smallInput}
                                />
                                <input
                                    type="text"
                                    name="expYear"
                                    placeholder="YYYY"
                                    value={paymentDetails.expYear}
                                    onChange={handleInputChange}
                                    className={styles.smallInput}
                                />
                            </div>
                            <input
                                type="text"
                                name="cvv"
                                placeholder="CVV"
                                value={paymentDetails.cvv}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" className={styles.submitButton}>
                    Pay Now
                </button>
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
            </form>
        </div>
    );
}
