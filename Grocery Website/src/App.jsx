import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import GroceryPage from "./pages/GroceryPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShoppingCartPage from "./pages/ShoppingCartPage.jsx";
import RegisterLoginPage from "./pages/RegisterLoginPage.jsx";
import TestingPage1 from "./pages/TestingPage1.jsx";
import NavbarTop from "./components/NavbarTop.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Register from "./pages/Register.jsx";
import AdminUpdate from "./pages/AdminUpdate.jsx";
import PaymentPage from "./pages/Payment.jsx";
import DashboardPage from "./pages/DashBoard.jsx";

function App() {
    const [totalCartItems, setTotalCartItems] = useState(0);
    const [loggedInUser, setLoggedInUser] = useState(null); // State to track the logged-in user

    // Function to update cart count based on current items in localStorage
    const updateCartCount = () => {
        const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const total = savedCartItems.reduce((acc, item) => acc + item.quantity, 0);
        setTotalCartItems(total);
    };

    // Fetch data from the API on initial render
    const fetchAPI = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api");
            console.log(response.data.random);
        } catch (error) {
            console.error("Error fetching API:", error);
        }
    };

    // Handle login
    const handleLogin = (username) => {
        setLoggedInUser(username);
        localStorage.setItem("loggedInUser", username); // Store the logged-in user in localStorage
    };

    // Handle log off
    const handleLogOff = () => {
        setLoggedInUser(null); // Clear logged-in user
        localStorage.removeItem("loggedInUser"); // Remove user from localStorage
    };

    // Initialize cart count and user session on initial render
    useEffect(() => {
        fetchAPI();
        updateCartCount();

        // Check if a user is already logged in (from localStorage)
        const savedUser = localStorage.getItem("loggedInUser");
        if (savedUser) {
            setLoggedInUser(savedUser);
        }
    }, []);

    return (
        <>
            {/* Pass loggedInUser, totalCartItems, and handleLogOff to NavbarTop */}
            <NavbarTop
                totalCartItems={totalCartItems}
                loggedInUser={loggedInUser}
                handleLogOff={handleLogOff}
            />
            <Router>
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/grocery-page" element={<GroceryPage updateCartCount={updateCartCount} />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/admin-update" element={<AdminUpdate />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                   
                    <Route
                        path="/shopping-cart"
                        element={
                            <ShoppingCartPage
                                updateCartCount={updateCartCount}
                                loggedInUser={loggedInUser} // Pass down loggedInUser for authentication checks
                            />
                        }
                    />
                    <Route
                        path="/login-page"
                        element={<LoginPage setLoggedInUser={handleLogin} />}
                    />
                   <Route path="/register" element={<Register />} />
                    <Route path="/testing1" element={<TestingPage1 />} />
                </Routes>

                
            </Router>
        </>
    );
}

export default App;
