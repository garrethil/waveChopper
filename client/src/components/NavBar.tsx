// filepath: /Users/garrethildebrandt/Fun/waveChopper/client/src/components/NavBar.tsx
import React from "react";
import { useHistory } from "react-router-dom";

interface NavBarProps {
  onLogout: () => void;
  isLoggedIn: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ onLogout, isLoggedIn }) => {
  const history = useHistory();

  const navigateToUpload = () => {
    history.push("/upload");
  };

  const navigateToProjects = () => {
    history.push("/projects");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1>Wave-Chopper</h1>
        <div className="flex space-x-4">
          <button
            onClick={navigateToUpload}
            className="px-3 py-2 text-white hover:bg-gray-700 rounded"
          >
            Upload Files
          </button>
          <button
            onClick={navigateToProjects}
            className="px-3 py-2 text-white hover:bg-gray-700 rounded"
          >
            View Projects
          </button>
        </div>
        {isLoggedIn && (
          <button
            onClick={onLogout}
            className="px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
