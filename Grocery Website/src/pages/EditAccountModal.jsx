import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/EditAccount.module.css";

export default function EditAccountPage({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    username: "",
    newUsername: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    full_name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    card_name: "",
    card_number: "",
    exp_month: "",
    exp_year: "",
    cvv: "",
  });
  const [activeSection, setActiveSection] = useState("updatePassword"); // Tracks which section is active
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "exp_month") {
        let formattedValue = value;

        // Handle single-digit input and add leading zero
        if (!isNaN(value) && value.length === 1) {
            if (value === "1" && formData.exp_month === "10") {
                formattedValue = "11"; // Transition to "11"
            } else if (value === "1" && formData.exp_month === "11") {
                formattedValue = "12"; // Transition to "12"
            } else {
                formattedValue = `0${value}`; // Add leading zero for single digits
            }
        }

        // Remove leading zero for valid months (10, 11, 12)
        if (value === "10" || value === "11" || value === "12") {
            formattedValue = value; // Keep "10", "11", "12" as is
        } else if (formattedValue.startsWith("0") && formattedValue.length === 3) {
            formattedValue = formattedValue.substring(1); // Remove leading zero
        }

        // Validate the formatted month value
        if (formattedValue < 1 || formattedValue > 12) {
            setErrorMessage("Please enter a valid month between 01 and 12.");
            return;
        } else {
            setErrorMessage(""); // Clear error message if valid
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: formattedValue,
        }));
    } else {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const endpoint =
        activeSection === "updateEmail"
          ? "http://localhost:3000/update-email"
          : activeSection === "updateCreditCard"
          ? "http://localhost:3000/update-creditcard"
          : "http://localhost:3000/update-password";

      const response = await axios.put(endpoint, formData);

      if (response.data.status === "success") {
        setSuccessMessage(
          activeSection === "updatePassword"
            ? "Password updated successfully!"
            : activeSection === "updateEmail"
            ? "Email updated successfully!"
            : "Credit card updated successfully!"
        );
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Failed to update account.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while updating the account."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h1 className={styles.title}>Edit Account</h1>

        {/* Dropdown for Section Selection */}
        <div className={styles.dropdownGroup}>
          <label htmlFor="sectionDropdown" className={styles.dropdownLabel}>
            Select Action:
          </label>
          <select
            id="sectionDropdown"
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className={styles.dropdown}
          >
            <option value="updatePassword">Update Password</option>
            <option value="updateEmail">Update Email</option>
            <option value="updateCreditCard">Update Credit Card</option>
          </select>
        </div>

        {/* Success/Error Messages */}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {activeSection === "updatePassword" && (
            <div className={styles.formGroup}>
              <h2 className={styles.sectionTitle}>Update Password</h2>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username" 
                value={formData.username}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="currentPassword">Current Password:</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                placeholder="Enter your current password" 
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="Enter your new password" 
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {activeSection === "updateEmail" && (
            <div className={styles.formGroup}>
              <h2 className={styles.sectionTitle}>Update Email</h2>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username" 
                value={formData.username}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">Current Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your current email" 
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="newEmail">New Email:</label>
              <input
                type="email"
                id="newEmail"
                name="newEmail"
                placeholder="Enter your new email" 
                value={formData.newEmail}
                onChange={handleChange}
                required
              />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {activeSection === "updateCreditCard" && (
            <div className={styles.formGroup}>
              <h2 className={styles.sectionTitle}>Update Credit Card</h2>
              <label htmlFor="full_name">Full Name:</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                placeholder="Enter the name, eg: John Doe"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                 placeholder="Enter the address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                 placeholder="Enter the city, eg: San Jose"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <label htmlFor="state">State:</label>
              <input
                type="text"
                id="state"
                name="state"
                placeholder="Enter the state, eg: California"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <label htmlFor="zip_code">Zip Code:</label>
              <input
                type="text"
                id="zip_code"
                name="zip_code"
                placeholder="Must be 5 digits, eg: 11111"
                value={formData.zip_code}
                onChange={handleChange}
                maxLength={5}
                required
              />
              <label htmlFor="card_name">Card Name:</label>
              <input
                type="text"
                id="card_name"
                name="card_name"
                placeholder="Enter the name, eg: John Doe"
                value={formData.card_name}
                onChange={handleChange}
                required
              />
              <label htmlFor="card_number">Card Number:</label>
              <input
                type="text"
                id="card_number"
                name="card_number"
                placeholder="Must be 16 digits card number"
                value={formData.card_number}
                onChange={handleChange}
                maxLength={16}
                required
              />
              <label htmlFor="exp_month">Expiration Month:</label>
              <input
                type="text"
                id="exp_month"
                name="exp_month"
                value={formData.exp_month}
                placeholder="Enter the month; must be 2 digits"
                className={formData.exp_month_error ? "inputError" : ""}
                onChange={handleChange}
                maxLength={2}
                required
              />
              <label htmlFor="exp_year">Expiration Year:</label>
              <input
                type="text"
                id="exp_year"
                name="exp_year"
                placeholder="Enter the year; must be 2 digits"
                value={formData.exp_year}
                onChange={handleChange}
                maxLength={2}
                required
              />
              <label htmlFor="cvv">CVV:</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="3 digits back of your card" 
                value={formData.cvv}
                onChange={handleChange}
                maxLength={3}
                required
              />
            </div>
          )}

          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
