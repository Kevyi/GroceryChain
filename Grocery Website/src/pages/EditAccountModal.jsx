import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/EditAccount.module.css"; // Import your CSS

export default function EditAccountPage({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Validate if new password is the same as current password
    if (formData.newPassword === formData.currentPassword) {
      setErrorMessage("The new password cannot be the same as the current password.");
      return;
    }

    try {
      const response = await axios.put("http://localhost:3000/edit-account", formData);
      if (response.data.status === "success") {
        setSuccessMessage("Account updated successfully!");
        setErrorMessage("");
      } else if (response.data.message === "User not found.") {
        setErrorMessage("The user account does not exist.");
        } else {
            setErrorMessage(response.data.message || "Failed to update account.");
        }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred while updating the account."
      );
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h1 className={styles.title}>Edit Account</h1>

        {/* Display Success or Error Message */}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Username */}
          <div className={styles.formGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Current Password */}
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Current Password:</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* New Password */}
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
