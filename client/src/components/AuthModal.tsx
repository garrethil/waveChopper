import React, { useState } from "react";

interface AuthModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onAuthSuccess: (message: string, type: "success" | "error") => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLogin,
  onAuthSuccess,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    const endpoint = isLogin
      ? "http://localhost:8000/api/auth/login"
      : "http://localhost:8000/api/auth/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Login success
          localStorage.setItem("authToken", data.token);
          onLogin(email, password); // Pass email and password to the parent onLogin function
          onAuthSuccess("Login successful!", "success"); // Trigger success alert
        } else {
          // Signup success
          onAuthSuccess("Signup successful! Please log in.", "success");
        }
      } else {
        onAuthSuccess(data.message || "An error occurred.", "error"); // Trigger error alert
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      onAuthSuccess("An error occurred. Please try again.", "error"); // Trigger error alert
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
