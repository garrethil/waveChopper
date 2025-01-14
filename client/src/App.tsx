import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";

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
      <Switch>
        {/* Login Route */}
        <Route
          path="/"
          exact
          render={() =>
            isLoggedIn ? (
              <Redirect to="/upload" />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        {/* Upload Route */}
        <Route
          path="/upload"
          render={() =>
            isLoggedIn ? (
              <UploadPage onLogout={handleLogout} />
            ) : (
              <Redirect to="/" />
            )
          }
        />

        {/* Fallback for undefined routes */}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
