import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        email,
        password
      });
      console.log(response.data);

      // Show modal after successful sign up
      setShowModal(true);

      // Optionally, reset the form after successful sign up
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error signing up:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  // Close modal after user clicks OK
  const closeModal = () => {
    setShowModal(false);
    // Redirect to sign-in page after successful sign-up, if needed
    window.location.href = "/signin";  // Optional: Automatically redirect to sign-in
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp} className="auth-form">
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/signin">Sign In</a>
      </p>

      {/* Modal for successful sign-up */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Sign Up Successfully!</h3>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
