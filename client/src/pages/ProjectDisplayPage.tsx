import React, { useEffect, useState } from "react";
import Project from "../components/Project";

// Define types for the API response
interface Project {
  name: string;
  originalFile?: { key: string; url: string };
  manipulatedFile?: { key: string; url: string };
}

const ProjectDisplayPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

        if (!data.projects || !Array.isArray(data.projects)) {
          throw new Error("Invalid response format from API");
        }

        console.log("Fetched Projects:", data.projects);
        setProjects(data.projects);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error fetching projects:", err.message);
          setError(err.message);
        } else {
          console.error("Unknown error occurred.");
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false); // Ensure loading is set to false in all cases
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (projectName: string) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        "http://localhost:8000/api/projects/delete-project",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ projectName }),
        }
      );

      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.name !== projectName)
        );
        setSelectedProject(null);
      } else {
        const errorText = await response.text();
        console.error("Failed to delete project:", errorText);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Your Projects</h1>
      {selectedProject ? (
        <div>
          <button
            onClick={() => setSelectedProject(null)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Back to Projects
          </button>
          <h2 className="text-xl font-semibold">{selectedProject.name}</h2>
          <div className="mt-4">
            {selectedProject.originalFile && (
              <div>
                <a
                  href={selectedProject.originalFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Download Original File
                </a>
              </div>
            )}
            {selectedProject.manipulatedFile && (
              <div>
                <a
                  href={selectedProject.manipulatedFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Download Manipulated File
                </a>
              </div>
            )}
          </div>
          <button
            onClick={() => handleDelete(selectedProject.name)}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <li
              key={project.name}
              onClick={() => setSelectedProject(project)}
              className="cursor-pointer bg-white p-4 shadow rounded hover:bg-gray-100"
            >
              <h3 className="font-semibold">{project.name}</h3>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectDisplayPage;
