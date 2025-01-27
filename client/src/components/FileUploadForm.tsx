import React, { useState } from "react";

const FileUploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [manipulationType, setManipulationType] = useState<string>("reverse");
  const [isUploading, setIsUploading] = useState<boolean>(false); // Loading state

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile || !projectName.trim()) {
      alert("Please select a file and enter a project name.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to upload files.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("projectName", projectName); // Include project name
    formData.append("manipulationType", manipulationType); // Include manipulation type

    setIsUploading(true); // Start loading
    try {
      const response = await fetch(
        "http://localhost:8000/api/projects/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file.");
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);
      alert(
        `File uploaded to project "${projectName}" successfully with manipulation "${manipulationType}"!`
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false); // Stop loading
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Upload WAV File</h1>
      </div>
      {isUploading ? (
        <div className="text-center text-blue-500 font-semibold">
          Uploading file, please wait...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="block">
            <span className="text-gray-700">Project Name:</span>
            <input
              type="text"
              value={projectName}
              placeholder="Enter project name"
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-2 block w-full border rounded px-4 py-2 text-sm"
              required
              disabled={isUploading} // Disable input during upload
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Choose a .wav file:</span>
            <input
              type="file"
              accept=".wav"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
              disabled={isUploading} // Disable file input during upload
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Manipulation Type:</span>
            <select
              value={manipulationType}
              onChange={(e) => setManipulationType(e.target.value)}
              className="mt-2 block w-full border rounded px-4 py-2 text-sm"
              required
              disabled={isUploading} // Disable dropdown during upload
            >
              <option value="reverse">Reverse</option>
              <option value="jumble">Jumble</option>
            </select>
          </label>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isUploading} // Disable button during upload
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      )}
    </div>
  );
};

export default FileUploadForm;
