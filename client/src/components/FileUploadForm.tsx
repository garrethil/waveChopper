import React, { useState } from "react";

interface FileUploadFormProps {
  onLogout: () => void;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onLogout }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a .wav file to upload.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to upload files.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

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
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Upload WAV File</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Log Out
        </button>
      </div>
      <p className="text-gray-600 text-center mb-6">
        Select a .wav file to upload and manipulate.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label className="block">
          <span className="text-gray-700">Choose a .wav file:</span>
          <input
            type="file"
            accept=".wav"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Upload
        </button>
      </form>
      <p className="text-center text-gray-500 text-sm mt-4">
        Only .wav files are supported
      </p>
    </div>
  );
};

export default FileUploadForm;
