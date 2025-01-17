import React from "react";

interface ProjectProps {
  name: string;
  lastModified: string;
  size: number;
  url: string;
}

const Project: React.FC<ProjectProps> = ({ name, lastModified, size, url }) => {
  return (
    <li className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-lg font-semibold mb-2">{name}</h2>
      <p className="text-gray-600">
        Last Modified: {new Date(lastModified).toLocaleString()}
      </p>
      <p className="text-gray-600">Size: {(size / 1024).toFixed(2)} KB</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Open File
      </a>
    </li>
  );
};

export default Project;
