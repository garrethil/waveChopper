import React, { useState } from "react";

interface AuthModalProps {
  onClose: () => void;
  onLogin: () => void;
  onAuthSuccess: (message: string, type: "success" | "error") => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_BASE_URL = "https://wave-chopper-2dc5d4458dd7.herokuapp.com/";
  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    const endpoint = isLogin
      ? `${API_BASE_URL}api/auth/login`
      : `${API_BASE_URL}api/auth/register`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        onAuthSuccess(
          isLogin
            ? "Login successful!"
            : "Signup successful! You are now logged in.",
          "success"
        );
      } else {
        onAuthSuccess(data.message || "An error occurred.", "error");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      onAuthSuccess("An error occurred. Please try again.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Log In" : "Sign Up"}
        </h2>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline text-sm"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Log In"}
        </button>
        <form onSubmit={handleAuth} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-4 py-2 w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-4 py-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
