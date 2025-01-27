import React, { useState } from "react";
import AuthModal from "../components/AuthModal";

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuth = (endpoint: string, email: string, password: string) => {
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json().then((data) => ({ data, ok: res.ok })))
      .then(({ data, ok }) => {
        if (ok) {
          if (endpoint.includes("login")) {
            // Handle successful login
            localStorage.setItem("authToken", data.token);
            onLogin(); // Update parent state
            alert("Login successful!");
          } else {
            // Handle successful signup
            alert("Signup successful! Please log in.");
          }
          setShowAuthModal(false);
        } else {
          alert(data.message || "An error occurred.");
        }
      })
      .catch((error) => {
        console.error("Error during authentication:", error);
        alert("An error occurred. Please try again.");
      });
  };

  const handleLogin = (email: string, password: string) => {
    handleAuth("http://localhost:8000/api/auth/login", email, password);
  };

  const handleSignup = (email: string, password: string) => {
    handleAuth("http://localhost:8000/api/auth/register", email, password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary">
      <h2>Please login or signup to start chopping</h2>
      <button
        onClick={() => setShowAuthModal(true)}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        Log In / Sign Up
      </button>
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      )}
    </div>
  );
};

export default LoginPage;
