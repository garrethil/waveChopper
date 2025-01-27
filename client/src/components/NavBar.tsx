import React, { useState } from "react";
import { useHistory } from "react-router-dom";

interface NavBarProps {
  onLogout: () => void;
  isLoggedIn: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ onLogout, isLoggedIn }) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const navigateToHome = () => {
    history.push("/");
  };

  const navigateToUpload = () => {
    history.push("/upload");
  };

  const navigateToProjects = () => {
    history.push("/projects");
  };

  return (
    <nav className="bg-primary-headerBG text-primary-headerText p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand and Home Button */}
        <button onClick={navigateToHome}>
          <h1 className="text-3xl font-bold">Wave-Chopper</h1>
        </button>

        {/* Hamburger Menu for Small Screens */}
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
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6 w-full md:w-auto`}
        >
          {isLoggedIn && (
            <div className="flex flex-col md:flex-row md:items-center md:space-x-10 w-full">
              <div className="flex flex-col md:flex-row md:space-x-6">
                <button
                  onClick={navigateToUpload}
                  className="px-3 py-2 text-white hover:bg-gray-700 rounded"
                >
                  + New Project
                </button>
                <button
                  onClick={navigateToProjects}
                  className="px-3 py-2 text-white hover:bg-gray-700 rounded"
                >
                  View Projects
                </button>
              </div>

              {/* Log Out Button */}
              <button
                onClick={onLogout}
                className="px-3 py-2 mt-4 md:mt-0 md:ml-auto text-white bg-red-500 hover:bg-red-600 rounded"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
