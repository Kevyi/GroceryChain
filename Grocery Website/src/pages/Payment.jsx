import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/paymentPage.module.css";
import CreditCardImage from "../CreditCard.jpg";

export default function PaymentPage() {
    const navigate = useNavigate(); // Initialize navigate
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

        if (name === "expMonth") {
            // Ensure input is numeric and length is at most 2
            if (!/^\d*$/.test(value) || value.length > 2) return;

            let formattedValue = value;

            if (value.length === 1) {
                // Allow single-digit input temporarily
                if (value === "1") {
                    formattedValue = value; // Allow '1' to wait for the second digit
                } else if (value >= "1" && value <= "9") {
                    // Add leading zero for single digits other than '1'
                    formattedValue = `0${value}`;
                } else {
                    return; // Ignore invalid input (e.g., '0')
                }
            } else if (value.length === 2) {
                // Allow valid two-digit months (10, 11, 12) after '1'
                if (value[0] === "1" && (value[1] === "0" || value[1] === "1" || value[1] === "2")) {
                    formattedValue = value; // Allow '10', '11', '12'
                } else if (value[0] === "0" && value[1] >= "1" && value[1] <= "9") {
                    // Ensure the leading zero is preserved for single-digit months (01-09)
                    formattedValue = value;
                } else {
                    return; // Prevent invalid two-digit months
                }
            }

            // Update the state with the formatted value
            setPaymentDetails((prevDetails) => ({
                ...prevDetails,
                [name]: formattedValue,
            }));
            return;
        }

        // Default handler for other fields
        setPaymentDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (name === "expMonth") {
            if (value.length === 1 && value === "1") {
                // If the user clicks away after typing '1', default it to '01'
                setPaymentDetails((prevDetails) => ({
                    ...prevDetails,
                    [name]: `01`,
                }));
            }
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        const {
            name,
            address,
            city,
            state,
            zipcode,
            cardName,
            cardNumber,
            expMonth,
            expYear,
            cvv,
        } = paymentDetails;

        // Validate fields before sending to the server
        if (
            name &&
            address &&
            city &&
            state &&
            zipcode &&
            cardName &&
            cardNumber &&
            expMonth &&
            expYear &&
            cvv
        ) {
            try {
                const response = await fetch("http://localhost/CreditCard.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        full_name: name,
                        address,
                        city,
                        state,
                        zip_code: zipcode,
                        card_name: cardName,
                        card_number: cardNumber,
                        exp_month: expMonth,
                        exp_year: expYear,
                        cvv,
                    }),
                });

                const data = await response.json();
                console.log("Backend response:", data);

                if (data.status === "success") {
                    setPaymentStatus("Payment Successful! 🎉");
                    // Redirect to the Shopping Cart page with success state
                    setTimeout(() => {
                        navigate("/shopping-cart", { state: { success: true } });
                    }, 1000); // Wait 1 second to display success message
                } else {
                    setPaymentStatus(data.message);
                }
            } catch (error) {
                setPaymentStatus("Error: Unable to process payment. Please try again later.");
                console.error("Payment Error:", error);
            }
        } else {
            setPaymentStatus("Please fill in all the fields to proceed with the payment.");
        }
    };

    return (
        <div className={styles.paymentPage}>
            <form className={styles.paymentForm} onSubmit={handlePayment}>
                <h1 className={styles.pageTitle}>Payment Page</h1>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <h3>Billing Address</h3>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Full Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={paymentDetails.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="address">Address:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={paymentDetails.address}
                                onChange={handleInputChange}
                                placeholder="Enter your address"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="city">City:</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={paymentDetails.city}
                                onChange={handleInputChange}
                                placeholder="Enter your city"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label htmlFor="state">State:</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={paymentDetails.state}
                                    onChange={handleInputChange}
                                    placeholder="Enter your state"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="zipcode">Zip Code:</label>
                                <input
                                    type="text"
                                    id="zipcode"
                                    name="zipcode"
                                    value={paymentDetails.zipcode}
                                    onChange={handleInputChange}
                                    placeholder="Enter your zip code"
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <h3>Payment Info</h3>
                        <div className={styles.formGroup}>
                            <label>Cards Accepted:</label>
                            <img src={CreditCardImage} alt="Accepted Cards" className={styles.cardsImage} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="cardName">Name on Card:</label>
                            <input
                                type="text"
                                id="cardName"
                                name="cardName"
                                value={paymentDetails.cardName}
                                onChange={handleInputChange}
                                placeholder="Enter name on card"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="cardNumber">Credit Card Number:</label>
                            <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                value={paymentDetails.cardNumber}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label htmlFor="expMonth">Exp. Month:</label>
                                <input
                                    type="text"
                                    id="expMonth"
                                    name="expMonth"
                                    value={paymentDetails.expMonth}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="MM"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="expYear">Exp. Year:</label>
                                <input
                                    type="text"
                                    id="expYear"
                                    name="expYear"
                                    value={paymentDetails.expYear}
                                    onChange={handleInputChange}
                                    placeholder="YYYY"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="cvv">CVV:</label>
                                <input
                                    type="password"
                                    id="cvv"
                                    name="cvv"
                                    value={paymentDetails.cvv}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className={styles.submitButton}>
                    Pay Now
                </button>
                {paymentStatus && (
                    <p
                        className={
                            paymentStatus.startsWith("Payment Successful")
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
