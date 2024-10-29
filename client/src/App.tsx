import React, { useState } from "react";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a .wav file to upload.");
      return;
    }

    // Submit form data logic (e.g., using fetch or Axios to send the file to the backend)
    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("File uploaded successfully:", data);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Upload WAV File</h1>
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
    </div>
  );
};

export default App;
