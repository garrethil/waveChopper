import React, { useState, useEffect } from "react";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a .wav file to upload.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to upload files.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file.");
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

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
          setIsLoggedIn(true);
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

  const handleSignup = (email: string, password: string) => {
    fetch("http://localhost:8000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Signup successful! Please log in.");
          setShowAuthModal(false);
        } else {
          alert(data.message || "Signup failed.");
        }
      })
      .catch((error) => {
        console.error("Signup error:", error);
        alert("Error signing up. Please try again.");
      });
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-4">
              Upload WAV File
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Select a .wav file to upload and manipulate.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <label className="block">
                <span className="text-gray-700">Choose a .wav file:</span>
                <input
                  type="file"
                  accept=".wav"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </label>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Upload
              </button>
            </form>
            <p className="text-center text-gray-500 text-sm mt-4">
              Only .wav files are supported
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// Auth Modal Component
const AuthModal: React.FC<{
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string) => void;
}> = ({ onClose, onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onSignup(email, password);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Log In" : "Sign Up"}
        </h2>
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
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full bg-gray-300 text-gray-800 font-semibold py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Switch to {isLogin ? "Sign Up" : "Log In"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
