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
  });
  const [activeSection, setActiveSection] = useState("updatePassword"); // Tracks which section is active
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

    // Validate input based on the active section
    if (activeSection === "updatePassword") {
        // Prevent using the same password
        if (formData.newPassword === formData.currentPassword) {
            setErrorMessage(
                "The new password cannot be the same as the current password."
            );
            return;
        }
    } else if (activeSection === "updateEmail") {
        // Prevent using the same email
        if (formData.newEmail === formData.email) {
            setErrorMessage(
                "The new email cannot be the same as the current email."
            );
            return;
        }
    }

    try {
        // Dynamically set the endpoint based on the active section
        const endpoint =
            activeSection === "updateEmail"
                ? "http://localhost:3000/update-email"
                : "http://localhost:3000/update-password"; // Corrected endpoint logic

        // Send the form data to the correct endpoint
        const response = await axios.put(endpoint, formData);

        if (response.data.status === "success") {
            setSuccessMessage(
                activeSection === "updatePassword"
                    ? "Password updated successfully!"
                    : "Email updated successfully!"
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
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="currentPassword">Current Password:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
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
                )}

                {activeSection === "updateEmail" && (
                    <div className={styles.formGroup}>
                        <h2 className={styles.sectionTitle}>Update Email</h2>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="email">Current Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="newEmail">New Email:</label>
                        <input
                            type="email"
                            id="newEmail"
                            name="newEmail"
                            value={formData.newEmail}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
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