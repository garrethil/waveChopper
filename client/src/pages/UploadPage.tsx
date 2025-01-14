import React from "react";
import FileUploadForm from "../components/FileUploadForm";

const UploadPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <FileUploadForm onLogout={onLogout} />
    </div>
  );
};

export default UploadPage;
