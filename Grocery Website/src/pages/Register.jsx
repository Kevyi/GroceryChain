import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    date_of_birth: "",
    country: "",
  });

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/Register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });
  
      const result = await response.json();
      console.log(result); // Debug backend response
      if (result.status === "success") {
        setRegisterMessage({ type: "success", text: "Registration successful!" });
        setRegisterData({
          username: "",
          email: "",
          password: "",
          date_of_birth: "",
          country: "",
        }); // Clear input fields
      } else if (result.status === "error" && result.message) {
        setRegisterMessage({ type: "error", text: result.message });
      } else {
        setRegisterMessage({ type: "error", text: "Unexpected response from server." });
      }
    } catch (error) {
      console.error("Error:", error);
      setRegisterMessage({ type: "error", text: "An error occurred. Please try again." });
    }
  };
  

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f9",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
          Create a New Account
        </h1>

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          User ID
        </label>
        <input
          type="text"
          name="username"
          placeholder="Enter your User ID"
          value={formData.username}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Date of Birth
        </label>
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Country
        </label>
        <input
          type="text"
          name="country"
          placeholder="Enter your Country"
          value={formData.country}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Register
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: message.includes("success") ? "green" : "red",
          }}
        >
          {message}
        </p>
      </form>
      <p style={{ marginTop: "20px", fontSize: "16px", color: "red" }}>{message}</p>
      <div style={{ marginTop: "20px" }}>
        <a href= "/login-page" style={{ fontSize: "16px", textDecoration: "none", color: "#007bff" }}>
          New User? Go register here
        </a>
      </div>
    </div>
  );
}

export default App;