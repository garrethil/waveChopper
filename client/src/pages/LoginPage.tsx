import React, { useState } from "react";
import AuthModal from "../components/AuthModal";
import AlertModal from "../components/AlertModal";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  // State for the modal
  const [modalState, setModalState] = useState<{
    type: "login" | "alert" | null;
    data?: { message?: string; type?: "success" | "error" };
  }>({ type: null });

  // Open modal with specified type and data
  const openModal = (
    type: "login" | "alert",
    data?: { message?: string; type?: "success" | "error" }
  ) => {
    setModalState({ type, data });
  };

  // Close modal and trigger onLogin if success
  const closeModal = () => {
    if (modalState.type === "alert" && modalState.data?.type === "success") {
      onLogin();
    }
    setModalState({ type: null });
  };

  // Handle authentication success
  const handleAuthSuccess = (message: string, type: "success" | "error") => {
    openModal("alert", { message, type });
  };

  return (
    <div className="flex bg-primary items-center justify-center h-screen pb-20">
      {modalState.type === "login" && (
        <AuthModal
          onClose={closeModal}
          onLogin={onLogin}
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
      <div className="pb-[200px] md:pb-20">
        <button
          className="p-4 bg-primary-headerText rounded text-primary-headerBG text-lg md:text-2xl font-semibold hover:text-primary-bodyText"
          onClick={() => openModal("login")}
        >
          Login / Signup
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
