import styles from "./componentsStyle/navbar.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { BiFoodMenu } from "react-icons/bi";
import { IoIosLogIn } from "react-icons/io";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa"; // Added FaTimes
import { IoPerson } from "react-icons/io5";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../App.jsx";

export default function NavbarTop() {
  // Get the logged-in state from App.jsx
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  const [query, setQuery] = useState(""); // State to manage the search query
  const navigate = useNavigate();

  function isUserLoggedIn() {
    const getToken = async () => {
      const token = localStorage.getItem("token");

      // If no token, assume user is logged out
      if (token === "No token") return;

      try {
        const response = await fetch("http://localhost:8080/verifying-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token }),
        });

        const data = await response.json();

        if (!isLoggedIn) {
          setIsLoggedIn(true);
          navigate("/home");
        }
      } catch (error) {
        console.error("Error verifying login:", error);
        setIsLoggedIn(false);
      }
    };

    getToken();
  }

  const handleLogout = () => {
    localStorage.setItem("token", "No token");
    setIsLoggedIn(false);
    navigate("/home");
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (query.trim()) {
      // Navigate to the grocery page with the search query
      navigate(`/grocery-page?query=${encodeURIComponent(query)}`);
      setQuery(""); // Clear the search field
    }
  };

  // **Added handleClearSearch function**
  const handleClearSearch = () => {
    setQuery("");
    navigate("/grocery-page"); // Navigate to grocery page without query
  };

  useEffect(() => {
    isUserLoggedIn();
  }, [isLoggedIn]);

  return (
    <nav className={styles["navbar"]}>
      <div>
        <Link to="/home">
          <GiForkKnifeSpoon className={styles["logo"]} />
        </Link>
      </div>

      {/* Search Bar */}
      <form className={styles["search"]} onSubmit={handleSearch}>
        <input
          className={styles["field"]}
          placeholder="Search Freshie"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update query state
        />
        {/* **Added clear search icon** */}
        {query && (
          <FaTimes
            className={styles["clear-icon"]}
            onClick={handleClearSearch}
          />
        )}
        <button type="submit">
          <FaSearch className={styles["search-icon"]} />
        </button>
      </form>

      {/* Menu Links */}
      <div className={styles["menu"]}>
        <div className={styles["menu-links"]}>
          <Link to="/grocery-page">
            <FaBars />
            <div>Shop</div>
          </Link>

          <Link to="/shopping-cart">
            <FaShoppingCart />
            <div>Shopping Cart</div>
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/account-page">
                <IoPerson />
              </Link>
              <button onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login-page">
                <IoPerson />
                <div>Sign In / Register</div>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
