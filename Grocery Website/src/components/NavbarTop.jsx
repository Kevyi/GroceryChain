import React, { useState, useEffect } from "react";
import styles from "./componentsStyle/navbar.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaBars } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import HistoryModal from "../pages/HistoryModal";
import AdminApprovalModal from "../pages/AdminApprovalModal"; // Import AdminApprovalModal
import EditAccountModal from "../pages/EditAccountModal"; // Import EditAccountModal

export default function NavbarTop({ totalCartItems, handleLogOff, loggedInUser }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearched, setIsSearched] = useState(false); // Track if a search has been executed
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userData, setUserData] = useState({ username: "", isAdmin: false }); // Persisted user data
    const [countdown, setCountdown] = useState(30); // Inactivity timeout countdown in seconds
    const [isActive, setIsActive] = useState(true); // Track user activity state
    const [logoutMessage, setLogoutMessage] = useState(""); // Message for inactivity logout
    const [isInactiveLogout, setIsInactiveLogout] = useState(false); // Track if logout is due to inactivity
    const [ShowHistoryModal, setShowHistoryModal] = useState(false);
    const [ShowAdminApprovalModal, setShowAdminApprovalModal] = useState(false); // State for Admin Approval Modal
    const [adminRequests, setAdminRequests] = useState([]); // Store pending admin requests
    const [ShowEditAccountModal, setShowEditAccountModal] = useState(false); // State for Edit Account Modal

    useEffect(() => {
        // Restore user data from localStorage or update with loggedInUser prop
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser) {
            setUserData(storedUser);
        } else if (loggedInUser) {
            setUserData(loggedInUser);
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        }
    }, [loggedInUser]);

    useEffect(() => {
        // Check if a search query exists in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get("search");
        if (searchQuery) {
            setSearchTerm(searchQuery);
            setIsSearched(true);
        }
    }, []);

    useEffect(() => {
        const resetInactivityTimer = () => {
            if (userData.username) {
                // Reset countdown only if user is logged in
                setIsActive(true); // User is active
                setCountdown(30); // Reset the countdown timer
            }
        };
    
        // Event listeners to detect user activity
        const handleUserActivity = () => {
            resetInactivityTimer();
        };
    
        // Attach event listeners for mouse and keyboard activity
        window.addEventListener("mousemove", handleUserActivity);
        window.addEventListener("keydown", handleUserActivity);
    
        // Timer to check inactivity and trigger logout
        const inactivityTimer = setInterval(() => {
            if (userData.username && isActive) {
                // Only decrement countdown and check inactivity if user is logged in
                setCountdown((prev) => {
                    if (prev === 1) {
                        handleInactiveLogout();
                        clearInterval(inactivityTimer); // Stop the timer on logout
                        return 0;
                    }
                    return prev - 1;
                });
            }
        }, 1000); // Decrease countdown every second
    
        return () => {
            // Cleanup event listeners and timer on unmount
            window.removeEventListener("mousemove", handleUserActivity);
            window.removeEventListener("keydown", handleUserActivity);
            clearInterval(inactivityTimer);
        };
    }, [isActive, userData.username]);

    // Fetch admin requests for the Admin Approval Modal
    useEffect(() => {
        if (ShowAdminApprovalModal && userData.isAdmin) {
            fetch("http://localhost:3000/pending-admins") // Fetch pending admin requests
                .then((response) => response.json())
                .then((data) => setAdminRequests(data.data || []))
                .catch((error) => console.error("Error fetching admin requests:", error));
        }
    }, [ShowAdminApprovalModal, userData.isAdmin]);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleInactiveLogout = () => {
        if (userData.username) {
            // Proceed only if the user is logged in
            setIsInactiveLogout(true);
            setUserData({ username: "", isAdmin: false }); // Clear user data
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("cartItems"); // Clear localStorage items
            setLogoutMessage("You have been logged out due to inactivity."); // Set logout message
    
            // Automatically fade out the message after a few seconds
            setTimeout(() => {
                setLogoutMessage(""); // Clear the message
                setIsInactiveLogout(false); // Reset inactivity state
            }, 3000); // 3-second timeout for fade-out
        }
    };
    
    const handleLogOffUser = (shouldRefresh = true) => {
        handleLogOff();
        setUserData({ username: "", isAdmin: false });
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("cartItems"); // Clear the cart items from localStorage
        if (!isInactiveLogout) setLogoutMessage("");
    
        if (shouldRefresh) {
            window.location.href = "/home";
        } else {
            updateCartCount(0); // Reset the cart count to 0 without refresh
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            window.location.href = `/grocery-page?search=${encodeURIComponent(searchTerm.trim())}`;
            setIsSearched(true);
        }
    };

    const handleReset = () => {
        setSearchTerm("");
        setIsSearched(false);
        window.location.href = "/grocery-page";
    };

    const handleApproveRequest = (adminId) => {
        fetch("http://localhost:3000/approve-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adminId, action: "approve" }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setAdminRequests((prev) => prev.filter((admin) => admin.id !== adminId));
                    alert(data.message);
                }
            })
            .catch((error) => console.error("Error approving admin:", error));
    };

    const handleRejectRequest = (adminId) => {
        fetch("http://localhost:3000/approve-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adminId, action: "reject" }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setAdminRequests((prev) => prev.filter((admin) => admin.id !== adminId));
                    alert(data.message);
                }
            })
            .catch((error) => console.error("Error rejecting admin:", error));
    };

    return (
        <>
            <nav className={styles["navbar"]}>
                {/* Logo and Brand Name */}
                <div className={styles["logo-container"]}>
                    <a href="/home" className={styles["logo"]}>
                        <GiForkKnifeSpoon />
                        <span className={styles["brand-name"]}>FreshBite</span>
                    </a>
                </div>

                {/* Search Bar */}
                <form className={styles["search"]} onSubmit={handleSearchSubmit}>
                    <input
                        className={styles["field"]}
                        placeholder="Search FreshBite"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isSearched ? (
                        <button type="button" className={styles["reset-button"]} onClick={handleReset}>
                            X
                        </button>
                    ) : (
                        <button type="submit">
                            <FaSearch className={styles["search-icon"]} />
                        </button>
                    )}
                </form>

                {/* Menu */}
                <div className={styles["menu"]}>
                    <div className={styles["menu-links"]}>
                    {userData.isAdmin ? (
                            <a href="/dashboard">
                                <FaBars />
                                <div>Dashboard</div>
                            </a>
                        ) : (
                            <a href="/grocery-page">
                                <FaBars />
                                <div>Shop</div>
                            </a>
                        )}

                        <a
                            href={userData.isAdmin ? "/admin-update" : "/shopping-cart"}
                            className={styles["cart-icon-container"]}
                        >
                            <FaShoppingCart />
                            {totalCartItems > 0 && (
                                <div className={styles["cart-item-counter-badge"]}>
                                    {totalCartItems}
                                </div>
                            )}
                            <div>{userData.isAdmin ? "Update Cart" : "Shopping Cart"}</div>
                        </a>

                        {userData.username ? (
                            <div
                                className={styles["user-dropdown"]}
                                onMouseEnter={toggleDropdown}
                                onMouseLeave={toggleDropdown}
                            >
                                <span className={styles["username"]}>
                                    {userData.username} ({userData.isAdmin ? "Admin" : "Customer"})
                                </span>

                                {isDropdownOpen && (
                                    <div className={styles["dropdown-menu"]}>
                                        {userData.isAdmin ? (
                                            <>
                                                {/* Admin Requests Option */}
                                                <button
                                                    onClick={() => setShowAdminApprovalModal(true)} // Open Admin Approval Modal
                                                    className={styles["dropdown-item"]}
                                                >
                                                    Admin Accounts Approvals
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {/* View Purchase History Option */}
                                                <button
                                                    onClick={() => setShowHistoryModal(true)} // Open History Modal
                                                    className={styles["dropdown-item"]}
                                                >
                                                    View Purchase History
                                                </button>
                                            </>
                                        )}

                                        {/* Edit Account Option */}
                                        <button
                                            onClick={() => setShowEditAccountModal(true)} // Open Edit Account Modal
                                            className={styles["dropdown-item"]}
                                        >
                                            Edit Account
                                        </button>

                                        {/* Log Off Option */}
                                        <button
                                            onClick={handleLogOffUser}
                                            className={styles["dropdown-item"]}
                                        >
                                            Log Off
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <a href="/login-page">
                                <div>Sign In / Register</div>
                            </a>
                        )}
                    </div>
                </div>
            </nav>

            {/* Logout Message */}
            {logoutMessage && (
                <div className={styles["logout-message"]} onClick={() => setLogoutMessage("")}>
                    <p>{logoutMessage}</p>
                </div>
            )}

            {/* History Modal */}
            {ShowHistoryModal && (
                <HistoryModal
                    isOpen={ShowHistoryModal}
                    historyDetails={{
                        history: JSON.parse(localStorage.getItem(userData.username)) || [],
                        totalWeight: 0,
                        totalPrice: 0,
                        shippingFee: 0,
                        finalPrice: 0,
                    }}
                    onClose={() => setShowHistoryModal(false)}
                />
            )}

            {/* Admin Approval Modal */}
            {ShowAdminApprovalModal && (
                <AdminApprovalModal
                    isOpen={ShowAdminApprovalModal}
                    adminRequests={adminRequests}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                    onClose={() => setShowAdminApprovalModal(false)}
                />
            )}

            {/* Edit Account Modal */}
            {ShowEditAccountModal && (
                <EditAccountModal
                    isOpen={ShowEditAccountModal}
                    userData={userData}
                    onClose={() => setShowEditAccountModal(false)}
                    onSave={(updatedData) => setUserData(updatedData)} // Update user data after save
                />
            )}
        </>
    );
}
