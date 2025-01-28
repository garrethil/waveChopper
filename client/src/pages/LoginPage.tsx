import React, { useState } from "react";
import AuthModal from "../components/AuthModal";
import AlertModal from "../components/AlertModal";

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  // State for the modal
  const [modalState, setModalState] = useState<{
    type: "login" | "alert" | null;
    data?: { message?: string; type?: "success" | "error" };
  }>({ type: null });

  const openModal = (
    type: "login" | "alert",
    data?: { message?: string; type?: "success" | "error" }
  ) => {
    setModalState({ type, data });
  };

  const closeModal = () => {
    // If the success modal is closed, trigger `onLogin`
    if (modalState.type === "alert" && modalState.data?.type === "success") {
      onLogin();
    }
    setModalState({ type: null });
  };

  const handleAuthSuccess = (message: string, type: "success" | "error") => {
    openModal("alert", { message, type });
  };

  return (
    <div className="flex bg-primary items-center justify-center h-screen pb-20">
      {modalState.type === "login" && (
        <AuthModal
          onClose={closeModal}
          onLogin={() => {}}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      {modalState.type === "alert" && modalState.data && (
        <AlertModal
          message={modalState.data.message!}
          type={modalState.data.type!}
          onClose={closeModal}
        />
      )}
      <button
        className="p-4 bg-primary-headerText rounded text-primary-headerBG font-semibold hover:text-primary-bodyText"
        onClick={() => openModal("login")}
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage;
