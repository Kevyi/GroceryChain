import React from "react";
import styles from "../styles/historyModal.module.css";

export default function HistoryModal({ isOpen, onClose, loggedInUser }) {
  if (!isOpen) return null;

  const username = loggedInUser?.username || JSON.parse(localStorage.getItem("loggedInUser"))?.username || "Guest"; // Retrieve from state or localStorage
  const userHistoryKey = `history_${username}`;

  console.log("Logged-in username: ", username); // Debugging output

  const history = JSON.parse(localStorage.getItem(userHistoryKey)) || [];
  const grandTotal = history.reduce((sum, entry) => sum + entry.finalPrice, 0);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{username}'s Purchase History</h2>
        {history.length > 0 ? (
          <>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Details</th>
                  <th>Total Items</th>
                  <th>Total Price</th>
                  <th>Shipping Fee</th>
                  <th>Final Price</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => {
                  const totalItemCount = entry.items.reduce(
                    (count, item) => count + item.quantity,
                    0
                  );

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{new Date(entry.date).toLocaleString()}</td>
                      <td>{entry.items.map((item) => item.title).join(", ")}</td>
                      <td>{entry.items.map((item) => `${item.quantity}x ${item.title}`).join(", ")}</td>
                      <td>{totalItemCount}</td>
                      <td>${entry.totalPrice.toFixed(2)}</td>
                      <td>${entry.shippingFee.toFixed(2)}</td>
                      <td>${entry.finalPrice.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={styles.summary}>
              Grand Total: <span>${grandTotal.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <p className={styles.noHistoryMessage}>No purchase history found for {username}.</p>
        )}
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
}

