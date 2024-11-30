import React, { useState, useEffect } from "react";
import styles from "./componentsStyle/navbar.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaBars } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

export default function NavbarTop({ totalCartItems, handleLogOff, loggedInUser }) {
    const [searchTerm, setSearchTerm] = useState(""); // Store the search input
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userData, setUserData] = useState({ username: "", isAdmin: false }); // Persisted user data

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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogOffUser = () => {
        handleLogOff(); // Call external log-off function
        setUserData({ username: "", isAdmin: false }); // Clear user data state
        localStorage.removeItem("loggedInUser"); // Clear localStorage
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            window.location.href = `/grocery-page?search=${encodeURIComponent(searchTerm)}`;
        }
    };

    return (
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
                <button type="submit">
                    <FaSearch className={styles["search-icon"]} />
                </button>
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
                            <IoPerson />
                            <div>Sign In / Register</div>
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
}
