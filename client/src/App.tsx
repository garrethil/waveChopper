import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
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
      <NavBar onLogout={handleLogout} isLoggedIn={isLoggedIn} />

      <Switch>
        {/* Login Route */}
        <Route
          path="/"
          exact
          render={() =>
            isLoggedIn ? <HomePage /> : <LoginPage onLogin={handleLogin} />
          }
        />

        {/* Upload Route */}
        <Route
          path="/upload"
          render={() => (isLoggedIn ? <UploadPage /> : <Redirect to="/" />)}
        />

        {/* Project Display Route */}
        <Route
          path="/projects"
          render={() =>
            isLoggedIn ? <ProjectDisplayPage /> : <Redirect to="/" />
          }
        />

        {/* Fallback for undefined routes */}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
