import React, { useEffect, useState } from "react";
import Project from "../components/Project";

// Define the type for a project
interface Project {
  key: string;
  lastModified: string;
  size: number;
  url: string;
}

const ProjectDisplayPage = () => {
  const [projects, setProjects] = useState<Project[]>([]); // State for projects
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token is missing.");
        }

        const response = await fetch(
          "http://localhost:8000/api/projects/user-files",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        console.log("Fetched Projects:", data);
        setProjects(data.files || []);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error fetching projects:", err.message);
          setError(err.message);
        } else {
          console.error("Unknown error occurred.");
          setError("An unknown error occurred.");
        }
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!projects.length) {
    return <div>No projects found.</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Your Projects</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Project
            key={project.key}
            name={project.key.split("/").slice(1).join("/")} // Extract project name
            lastModified={project.lastModified}
            size={project.size}
            url={project.url}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProjectDisplayPage;
