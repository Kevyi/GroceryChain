import React, { useState } from "react";
import styles from "./componentsStyle/navbar.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaBars } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

export default function NavbarTop({ totalCartItems, loggedInUser, handleLogOff }) {
    const [searchTerm, setSearchTerm] = useState(""); // Store the search input
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            window.location.href = `/grocery-page?search=${encodeURIComponent(searchTerm)}`; // Redirect using window.location
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
                    onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
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

                    <a href="/shopping-cart" className={styles["cart-icon-container"]}>
                        <FaShoppingCart />
                        {totalCartItems > 0 && (
                            <div className={styles["cart-item-counter-badge"]}>
                                {totalCartItems}
                            </div>
                        )}
                        <div>Shopping Cart</div>
                    </a>

                    {loggedInUser ? (
                        <div
                            className={styles["user-dropdown"]}
                            onMouseEnter={toggleDropdown}
                            onMouseLeave={toggleDropdown}
                        >
                            <span className={styles["username"]}>{loggedInUser}</span>
                            {isDropdownOpen && (
                                <div className={styles["dropdown-menu"]}>
                                    <button
                                        onClick={handleLogOff}
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
