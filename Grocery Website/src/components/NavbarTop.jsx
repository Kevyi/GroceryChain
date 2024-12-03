import React, { useState, useEffect } from "react";
import styles from "./componentsStyle/navbar.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaBars } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import HistoryModal from "../pages/HistoryModal";

export default function NavbarTop({ totalCartItems, handleLogOff, loggedInUser }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearched, setIsSearched] = useState(false); // Track if a search has been executed
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userData, setUserData] = useState({ username: "", isAdmin: false }); // Persisted user data
    const [countdown, setCountdown] = useState(600); // Inactivity timeout countdown in seconds
    const [isActive, setIsActive] = useState(true); // Track user activity state
    const [logoutMessage, setLogoutMessage] = useState(""); // Message for inactivity logout
    const [isInactiveLogout, setIsInactiveLogout] = useState(false); // Track if logout is due to inactivity
    const [ShowHistoryModal, setShowHistoryModal] = useState(false);

    useEffect(() => {
        // Check if user is logged in or restore from localStorage
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser) {
            setUserData(storedUser); // Restore user data from localStorage
        } else if (loggedInUser) {
            setUserData(loggedInUser); // Update with loggedInUser if provided
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser)); // Persist in localStorage
        }
    }, [loggedInUser]); // Refresh when loggedInUser changes

    useEffect(() => {
        // Check if the URL contains a search query on component mount
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get("search");
        if (searchQuery) {
            setSearchTerm(searchQuery); // Populate the search term from the URL
            setIsSearched(true); // Show reset button
        }
    }, []);

    useEffect(() => {
        let timer;
        if (userData.username && isActive) {
            // Start countdown if user is active and logged in
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        handleInactiveLogout(); // Log out due to inactivity
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer); // Cleanup timer on unmount
    }, [userData.username, isActive]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleInactiveLogout = () => {
        setIsInactiveLogout(true); // Mark as inactive logout
        handleLogOffUser();
        setLogoutMessage("You have been logged out due to being inactive."); // Set logout message
    };

    const handleLogOffUser = () => {
        handleLogOff(); // Call external log-off function
        setUserData({ username: "", isAdmin: false }); // Clear user data state
        localStorage.removeItem("loggedInUser"); // Clear localStorage
        if (!isInactiveLogout) {
            setLogoutMessage(""); // Clear logout message for manual logouts
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            console.log("Search submitted:", searchTerm); // Debug log
            // Redirect to the grocery page with the search term as a query parameter
            window.location.href = `/grocery-page?search=${encodeURIComponent(searchTerm.trim())}`;
            setIsSearched(true); // Mark as searched
        }
    };

    const handleReset = () => {
        console.log("Reset clicked"); // Debug log
        setSearchTerm(""); // Clear the search term
        setIsSearched(false); // Reset the search state
        window.location.href = "/grocery-page"; // Redirect to the grocery page without query params
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

                <form
                    className={styles["search"]}
                    onSubmit={handleSearchSubmit}
                >
                    <input
                        className={styles["field"]}
                        placeholder="Search FreshBite"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isSearched ? (
                        // Show Reset button only after a search has been executed
                        <button
                            type="button"
                            className={styles["reset-button"]}
                            onClick={handleReset}
                        >
                            X
                        </button>
                    ) : (
                        // Show Search button when no search has been executed
                        <button type="submit">
                            <FaSearch className={styles["search-icon"]} />
                        </button>
                    )}
                </form>

                {/* Menu */}
                <div className={styles["menu"]}>
                    <div className={styles["menu-links"]}>
                        <a href="/grocery-page">
                            <FaBars />
                            <div>Shop</div>
                        </a>

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
                                        {/* View Purchase History Option */}
                                        <button
                                            onClick={() => setShowHistoryModal(true)} // Open the History Modal
                                            className={styles["dropdown-item"]}
                                        >
                                            View Purchase History
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
                        totalWeight: 0, // Calculate dynamically if needed
                        totalPrice: 0, // Calculate dynamically if needed
                        shippingFee: 0, // Adjust based on logic
                        finalPrice: 0, // Adjust based on logic
                    }}
                    onClose={() => setShowHistoryModal(false)}
                />
            )}
        </>
    );
}
