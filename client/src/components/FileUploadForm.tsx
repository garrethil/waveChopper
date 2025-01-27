import React, { useState, useEffect } from "react";

const FileUploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [manipulationType, setManipulationType] = useState<string>("reverse");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>(
    "Uploading file, please wait..."
  );

  useEffect(() => {
    const messages = [
      "Uploading file, please wait...",
      "Processing your file...",
      "Almost done...",
    ];
    if (isUploading) {
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        setUploadMessage(messages[index]);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [isUploading]);

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
    formData.append("projectName", projectName);
    formData.append("manipulationType", manipulationType);

    setIsUploading(true);
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

      await response.json();
      alert(
        `"${projectName}" uploaded successfully with manipulation "${manipulationType}"!`
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-start mt-8 min-h-screen p-4">
      <div className="w-full max-w-4xl shadow-lg rounded-lg p-8 bg-primary-headerBG">
        {isUploading ? (
          <div className="text-center text-primary-headerText font-semibold">
            {uploadMessage}
          </div>
        ) : (
          <div className="">
            <h1 className="text-2xl font-bold text-center mb-6">
              Upload New Project
            </h1>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {/* Project Name */}
              <label className="block col-span-1 sm:col-span-2">
                <span className="text-primary-bodyText">Project Name:</span>
                <input
                  type="text"
                  value={projectName}
                  placeholder="Enter project name"
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-2 block w-full border rounded px-4 py-2 text-sm"
                  required
                  disabled={isUploading}
                />
              </label>

              {/* File Input */}
              <label className="block">
                <span className="text-primary-bodyText">
                  Choose a .wav file:
                </span>
                <input
                  type="file"
                  accept=".wav"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm text-primary-bodyText file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  required
                  disabled={isUploading}
                />
              </label>

              {/* Manipulation Type */}
              <label className="block">
                <span className="text-primary-bodyText">
                  Manipulation Type:
                </span>
                <select
                  value={manipulationType}
                  onChange={(e) => setManipulationType(e.target.value)}
                  className="mt-2 block w-full border rounded px-4 py-2 text-sm"
                  required
                  disabled={isUploading}
                >
                  <option value="reverse">Reverse</option>
                  <option value="jumble">Jumble</option>
                </select>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="col-span-1 sm:col-span-2 w-full bg-blue-500 text-white font-semibold py-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadForm;
