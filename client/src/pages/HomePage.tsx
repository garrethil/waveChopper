import React from "react";
import { useHistory } from "react-router-dom";

interface HomePageProps {
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogout }) => {
  const history = useHistory();

  const navigateToUpload = () => {
    history.push("/upload");
  };

  const navigateToProjects = () => {
    history.push("/projects");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h1>
      <div className="flex space-x-4">
        <button
          onClick={navigateToUpload}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Upload Files
        </button>
        <button
          onClick={navigateToProjects}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          View Projects
        </button>
      </div>
      <button
        onClick={onLogout}
        className="mt-8 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Log Out
      </button>
    </div>
  );
};

export default HomePage;
