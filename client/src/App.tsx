import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import ProjectDisplayPage from "./pages/ProjectDisplayPage";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="font-mono">
        <NavBar onLogout={handleLogout} isLoggedIn={isLoggedIn} />

        <Routes>
          {/* Login Route */}
          <Route
            path="/"
            element={
              isLoggedIn ? <HomePage /> : <LoginPage onLogin={handleLogin} />
            }
          />

          {/* Upload Route */}
          <Route
            path="/upload"
            element={isLoggedIn ? <UploadPage /> : <Navigate to="/" />}
          />

          {/* Project Display Route */}
          <Route
            path="/projects"
            element={isLoggedIn ? <ProjectDisplayPage /> : <Navigate to="/" />}
          />

          {/* Fallback for undefined routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
