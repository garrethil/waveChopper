import React, { useEffect, useState } from "react";
const BACKEND_URL = "https://wave-chopper.herokuapp.com";

// Define types for the API response
interface Project {
  name: string;
  manipulationType: string;
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

        const response = await fetch(`${BACKEND_URL}/api/projects/user-files`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();

        if (!data.projects || !Array.isArray(data.projects)) {
          throw new Error("Invalid response format from API");
        }

        console.log("Fetched Projects:", data.projects);
        const projectsWithManipulationType = data.projects.map(
          (project: Project) => {
            const manipulationType = project.manipulatedFile?.key.split("-")[1];
            return {
              ...project,
              manipulationType,
            };
          }
        );
        setProjects(projectsWithManipulationType);
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

  if (loading)
    return (
      <div className="text-xl text-center bg-primary min-h-screen text-primary-headerText">
        Loading projects...
      </div>
    );
  if (error)
    return <div className="text-xl text-center mt-8">Error: {error}</div>;

  return (
    <div className="flex flex-col items-center p-6 bg-primary min-h-screen text-primary-text">
      {selectedProject ? (
        <div className="relative p-14 rounded-lg w-full bg-primary-headerBG flex flex-col">
          {/* Back to Projects Button */}
          <button
            onClick={() => setSelectedProject(null)}
            className="flex-col md:absolute top-4 left-4 px-4 py-2 mb-10 text-s md:text-lg text-primary-bodyText rounded outline hover:font-semibold hover:outline-primary-bodyText"
          >
            ↶ Back to Projects
          </button>

          {/* Project Name */}
          <h2 className="text-4xl font-semibold text-primary-headerText text-center mb-6 underline">
            {selectedProject.name}
          </h2>

          {/* Links */}
          <div className="flex flex-col items-center gap-4 mt-16">
            {selectedProject.manipulatedFile && (
              <a
                href={selectedProject.manipulatedFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 bg-green-100 text-primary-headerText rounded-lg shadow-lg hover:shadow-green-300 transition-all text-xl hover:bg-green-200 hover:text-primary-text"
              >
                View Manipulated File
              </a>
            )}
          </div>

          <div className="flex flex-col items-center mt-8">
            {selectedProject.originalFile && (
              <a
                href={selectedProject.originalFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-1 bg-blue-100 text-primary-headerText rounded-lg shadow-lg hover:shadow-blue-300 transition-all text-xl hover:bg-blue-200 hover:text-primary-text"
              >
                View Original File
              </a>
            )}
            {/* Delete Button */}
            <div className="">
              <button
                onClick={() => handleDelete(selectedProject.name)}
                className="flex-col md:absolute bottom-2 right-[140px] px-4 py-2 mb-10 text-s bg-red-500 hover:bg text-white rounded outline hover:font-semibold hover:outline-red-700"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[80%] flex flex-col justify-center text-primary-bodyText">
          <h1 className="text-2xl font-bold text-center mb-6 text-primary-headerText underline">
            Your Projects
          </h1>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {projects.map((project) => (
              <li
                key={project.name}
                onClick={() => setSelectedProject(project)}
                className="cursor-pointer text-primary-headerText p-4 shadow rounded outline-none transition-all duration-300 outline outline-2 hover:outline-4 outline-primary-headerBG"
              >
                <h3 className="font-semibold text-xl underline">
                  {project.name}
                </h3>
                <p className="text-sm text-primary-bodyText">
                  effect type:{" "}
                  <span className="underline"> {project.manipulationType}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectDisplayPage;
