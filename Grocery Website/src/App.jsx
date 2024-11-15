import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import GroceryPage from './pages/GroceryPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ShoppingCartPage from './pages/ShoppingCartPage.jsx';
import RegisterLoginPage from './pages/RegisterLoginPage.jsx';
import TestingPage1 from './pages/TestingPage1.jsx';
import NavbarTop from './components/NavbarTop.jsx';
import LoginPage from './pages/LoginPage.jsx';

function App() {
    const [totalCartItems, setTotalCartItems] = useState(0);

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

    // Call fetchAPI and updateCartCount on initial render
    useEffect(() => {
        fetchAPI();
        updateCartCount();
    }, []);

    return (
        <>
            {/* Pass totalCartItems to NavbarTop and updateCartCount to GroceryPage and ShoppingCartPage */}
            <NavbarTop totalCartItems={totalCartItems} />
            <Router>
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/grocery-page" element={<GroceryPage updateCartCount={updateCartCount} />} />
                    <Route path="/shopping-cart" element={<ShoppingCartPage updateCartCount={updateCartCount} />} />
                    <Route path="/register-login" element={<RegisterLoginPage />} />
                    <Route path="/testing1" element={<TestingPage1 />} />
                    <Route path="/login-page" element={<LoginPage />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
