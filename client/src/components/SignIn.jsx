import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/signin", {
        email,
        password,
      });

      console.log("Signed in with token:", response.data.token);

      // ✅ Save email, token, and userId to localStorage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userId", response.data.userId);

      // Show success modal
      setShowModal(true);
    } catch (error) {
      console.error("Error signing in:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  // Close modal and optionally redirect after successful login
  const closeModal = () => {
    setShowModal(false);
    window.location.href = "/"; // Change this if needed
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>

      {/* Modal for successful login */}
      {showModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <h3>Login Successful!</h3>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
