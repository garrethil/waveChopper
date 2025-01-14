import React, { useState } from "react";
import AuthModal from "../components/AuthModal";

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = (email: string, password: string) => {
    fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          onLogin();
          setShowAuthModal(false);
        } else {
          alert(data.message || "Login failed.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Error logging in. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
          onSignup={() => {}}
        />
      )}
    </div>
  );
};

export default LoginPage;
