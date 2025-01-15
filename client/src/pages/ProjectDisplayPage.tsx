import React, { useEffect, useState } from "react";

// Define the type for S3 objects
interface S3Object {
  Key: string;
  LastModified: string;
  ETag: string;
  ChecksumAlgorithm: string[];
  Size: number;
  StorageClass: string;
}

const ProjectDisplayPage = () => {
  const [projects, setProjects] = useState<S3Object[]>([]); // Define the state type
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    fetch("http://localhost:8000/api/projects/user-files")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data.Contents || []); // Use the Contents array from S3 response
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setError(err.message);
        setLoading(false);
      });
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
    <div>
      <h1>Projects</h1>
      <p>Total Projects: {projects.length}</p>
      <ul>
        {projects.map((project, index) => (
          <li key={index}>
            <strong>Key:</strong> {project.Key} <br />
            <strong>Last Modified:</strong>{" "}
            {new Date(project.LastModified).toLocaleString()} <br />
            <strong>Size:</strong> {project.Size} bytes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDisplayPage;
