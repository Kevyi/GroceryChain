import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/RegisterLogin.module.css";

export default function LoginRegister({ setLoggedInUser }) {
  const navigate = useNavigate(); // Initialize navigation hook
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    date_of_birth: "",
    country: "",
  });

  const [loginMessage, setLoginMessage] = useState({ type: "", text: "" });
  const [registerMessage, setRegisterMessage] = useState({ type: "", text: "" });

  const handleChange = (e, setData) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const clearMessages = () => {
    setLoginMessage({ type: "", text: "" });
    setRegisterMessage({ type: "", text: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages(); // Clear previous messages
    try {
      const response = await fetch("http://localhost/Login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      if (result.status === "success") {
        setLoginMessage({ type: "success", text: "Login successful!" });
        setLoggedInUser(loginData.username); // Update shared logged-in user state
        localStorage.setItem("loggedInUser", loginData.username); // Save in localStorage
        navigate("/"); // Redirect to home
      } else {
        setLoginMessage({ type: "error", text: result.message || "Login failed." });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginMessage({ type: "error", text: "An error occurred. Please try again." });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessages(); // Clear previous messages
    try {
      const response = await fetch("http://localhost/Register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();
      if (result.status === "success") {
        setRegisterMessage({ type: "success", text: "Registration successful! You can now log in." });
        setRegisterData({
          username: "",
          email: "",
          password: "",
          date_of_birth: "",
          country: "",
        }); // Clear input fields
        setTimeout(() => {
          setIsRegisterOpen(false); // Switch to login form after delay
          clearMessages(); // Clear success message after switching
        }, 2000);
      } else {
        setRegisterMessage({ type: "error", text: result.message || "Registration failed." });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setRegisterMessage({ type: "error", text: "An error occurred. Please try again." });
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setLoggedInUser(savedUser); // Load user on page refresh
    }
  }, [setLoggedInUser]);

  return (
    <div className={styles.main}>
      <h1 className={styles.welcomeMessage}>Welcome to GoodEats</h1>

      {!isRegisterOpen ? (
        <div className={styles.modalContent}>
          <h2 className={styles.centerRegistration}>Login</h2>
          <form onSubmit={handleLogin} className={styles.spacingForTextBlocks}>
            <input
              type="text"
              name="username"
              className={styles.inputBox}
              value={loginData.username}
              onChange={(e) => handleChange(e, setLoginData)}
              placeholder="Enter your username"
              required
            />
            <input
              type="password"
              name="password"
              className={styles.inputBox}
              value={loginData.password}
              onChange={(e) => handleChange(e, setLoginData)}
              placeholder="Enter your password"
              required
            />
            <button className={styles.submitButton} type="submit">
              Login
            </button>
          </form>
          {loginMessage.text && (
            <p
              className={
                loginMessage.type === "success"
                  ? styles.successMessage
                  : styles.errorMessage
              }
            >
              {loginMessage.text}
            </p>
          )}
          <p
            className={styles.inLineText}
            onClick={() => {
              setIsRegisterOpen(true);
              clearMessages();
            }}
          >
            New user? Click here to register.
          </p>
        </div>
      ) : (
        <div className={styles.modalContent}>
          <h2 className={styles.centerRegistration}>Register</h2>
          <form onSubmit={handleRegister} className={styles.spacingForTextBlocks}>
            <input
              type="text"
              name="username"
              className={styles.inputBox}
              value={registerData.username}
              onChange={(e) => handleChange(e, setRegisterData)}
              placeholder="Enter your username"
              required
            />
            <input
              type="email"
              name="email"
              className={styles.inputBox}
              value={registerData.email}
              onChange={(e) => handleChange(e, setRegisterData)}
              placeholder="Enter your email"
              required
            />
            <input
              type="password"
              name="password"
              className={styles.inputBox}
              value={registerData.password}
              onChange={(e) => handleChange(e, setRegisterData)}
              placeholder="Enter your password"
              required
            />
            <input
              type="date"
              name="date_of_birth"
              className={styles.inputBox}
              value={registerData.date_of_birth}
              onChange={(e) => handleChange(e, setRegisterData)}
            />
            <input
              type="text"
              name="country"
              className={styles.inputBox}
              value={registerData.country}
              onChange={(e) => handleChange(e, setRegisterData)}
              placeholder="Enter your country"
            />
            <button className={styles.submitButton} type="submit">
              Register
            </button>
          </form>
          {registerMessage.text && (
            <p
              className={
                registerMessage.type === "success"
                  ? styles.successMessage
                  : styles.errorMessage
              }
            >
              {registerMessage.text}
            </p>
          )}
          <p
            className={styles.inLineText}
            onClick={() => {
              setIsRegisterOpen(false);
              clearMessages();
            }}
          >
            Returning user? Click here to login.
          </p>
        </div>
      )}
    </div>
  );
}
