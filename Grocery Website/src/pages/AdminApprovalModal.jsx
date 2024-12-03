import React, { useState, useEffect } from "react";
import styles from "../styles/AdminApprovalModal.module.css"; // Create a CSS module for styling the modal

export default function AdminApprovalModal({ isOpen, onClose }) {
  const [pendingAdmins, setPendingAdmins] = useState([]);

  // Fetch pending admins when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPendingAdmins();
    }
  }, [isOpen]);

  const fetchPendingAdmins = async () => {
    try {
      const response = await fetch("http://localhost:3000/pending-admins");
      const data = await response.json();

      if (data.status === "success") {
        setPendingAdmins(data.data);
      } else {
        alert(data.message || "Failed to fetch pending admins.");
      }
    } catch (error) {
      console.error("Error fetching pending admins:", error);
      alert("An error occurred while fetching pending admins.");
    }
  };

  const handleAction = (username, action) => {
    fetch("http://localhost:3000/approve-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, action }), // Ensure username and action are included
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setPendingAdmins((prev) => prev.filter((admin) => admin.username !== username));
          alert(data.message);
        } else {
          alert(`Failed to ${action} admin: ${data.message}`);
        }
      })
      .catch((error) => console.error(`Error ${action}ing admin:`, error));
  };
  
  

  if (!isOpen) return null; // Render nothing if the modal is closed

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Admin Approval Dashboard</h2>
        <button onClick={onClose} className={styles.closeButton}>
          X
        </button>
        {pendingAdmins.length > 0 ? (
          <table className={styles.table}>
            <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Country</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingAdmins.map((admin) => {
              const dateOfBirth = new Date(admin.date_of_birth).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });
              const timeOfRequest = new Date(admin.date_of_birth).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              });
              return (
                <tr key={admin.username}>
                  <td>{admin.username}</td>
                  <td>{admin.email}</td>
                  <td>{admin.country}</td>
                  <td>{dateOfBirth}</td>
                  <td>
                    <button
                      className={styles.approveButton}
                      onClick={() => handleAction(admin.username, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className={styles.rejectButton}
                      onClick={() => handleAction(admin.username, "reject")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        ) : (
          <div className={styles.noPendingMessage}>
            <p>No pending admin requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}
