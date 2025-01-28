import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AlertModal from "./AlertModal";

const FileUploadForm: React.FC = () => {
  // States for file form fields and alerts
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [manipulationType, setManipulationType] = useState<string>("reverse");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>(
    "Uploading file, please wait..."
  );
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const history = useHistory();

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

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const maxSizeInBytes = 100 * 1024 * 1024; // 100MB

      if (file.size > maxSizeInBytes) {
        setAlert({
          message: "File size must be less than 100MB.",
          type: "error",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  // Handle manipulation type selection
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setManipulationType(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile || !projectName.trim()) {
      setAlert({
        message: "Please select a file and enter a project name.",
        type: "error",
      });
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setAlert({ message: "Please log in to upload files.", type: "error" });
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
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file.");
      }

      await response.json();
      setAlert({
        message: `"${projectName}" uploaded successfully with effect "${manipulationType}"!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setAlert({
        message: "Error uploading file. Please try again.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle success modal close
  const handleSuccessClose = () => {
    history.push("/projects");
  };

  return (
    <div className="flex justify-center items-start mt-8 min-h-screen p-4">
      <div className="w-full max-w-4xl shadow-lg rounded-lg p-8 bg-primary-headerBG">
        {isUploading ? (
          <div className="text-center text-primary-headerText font-semibold">
            {uploadMessage}
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-center text-primary-headerText mb-6">
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
                <span className="text-primary-bodyText">Select Effect:</span>
                <select
                  value={manipulationType}
                  onChange={handleSelectChange}
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
                className="col-span-1 sm:col-span-2 w-full bg-green-100 text-green-700 font-semibold py-3 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </form>

            {/* Effect Descriptions */}
            <div className="mt-8 p-4 rounded shadow-lg">
              <h2 className="text-lg font-semibold text-primary-headerText mb-4">
                Effect Descriptions
              </h2>
              <ul className="list-disc list-inside text-primary-bodyText">
                <li>
                  <strong>Reverse:</strong> Reverses the audio file.
                </li>
                <li>
                  <strong>Jumble:</strong> Randomizes chunks of the audio file.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
          onSuccessClose={handleSuccessClose}
        />
      )}
    </div>
  );
};

export default FileUploadForm;
