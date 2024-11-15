import React from "react";
import styles from "./componentsStyle/navbar.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaBars } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

export default function NavbarTop({ totalCartItems }) {
    return (
        <nav className={styles["navbar"]}>
            <div>
                <a href="/home">
                    <GiForkKnifeSpoon className={styles["logo"]} />
                </a>
            </div>

            <form className={styles["search"]}>
                <input
                    className={styles["field"]}
                    placeholder="Search GoodEats"
                />
                <button type="submit">
                    <FaSearch className={styles["search-icon"]} />
                </button>
            </form>

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

                    <a href="/login-page">
                        <IoPerson />
                        <div>Sign In / Register</div>
                    </a>
                </div>
            </div>
        </nav>
    );
}
