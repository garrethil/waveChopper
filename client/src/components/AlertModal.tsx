import React from "react";

const AlertModal: React.FC<{
  message: string;
  type: "success" | "error";
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-4 shadow-lg w-80">
        <h2
          className={`text-lg font-bold ${
            type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {type === "success" ? "Success" : "Error"}
        </h2>
        <p className="mt-2">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
