import React, { useState } from "react";
import { useHistory } from "react-router-dom";

interface NavBarProps {
  onLogout: () => void;
  isLoggedIn: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ onLogout, isLoggedIn }) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const navigateTo = (path: string) => {
    history.push(path);
  };

  return (
    <nav className="bg-primary-headerBG text-primary-headerText p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand and Home Button */}
        <button
          className="flex items-center justify-center"
          onClick={() => navigateTo("/")}
        >
          <img
            className="h-14 w-18"
            src="/wave-yellow.svg"
            alt="Wave-Chopper Logo"
          />
          <h1 className="text-3xl font-bold">Wave-Chopper</h1>
        </button>

        {/* Hamburger Menu for Small Screens (only when logged in) */}
        {isLoggedIn && (
          <div className="block md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Desktop Menu */}
        {isLoggedIn && (
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => navigateTo("/upload")}
              className="px-3 py-2 text-white hover:bg-gray-700 rounded"
            >
              +New Project
            </button>
            <button
              onClick={() => navigateTo("/projects")}
              className="px-3 py-2 text-white hover:bg-gray-700 rounded"
            >
              View Projects
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu (only when logged in) */}
      {isLoggedIn && isOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-2">
          <button
            onClick={() => navigateTo("/upload")}
            className="px-3 py-2 text-white hover:bg-gray-700 rounded"
          >
            +New Project
          </button>
          <button
            onClick={() => navigateTo("/projects")}
            className="px-3 py-2 text-white hover:bg-gray-700 rounded"
          >
            View Projects
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
