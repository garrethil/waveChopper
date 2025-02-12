import React, { useState } from "react";
import AuthModal from "../components/AuthModal";
import AlertModal from "../components/AlertModal";

interface LoginPageProps {
  onLogin: () => void;
}

//landing page for non-loggedin users

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
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
    setModalState({ type: null });
    if (modalState.type === "alert" && modalState.data?.type === "success") {
      onLogin();
    }
  };

  const handleAuthSuccess = (message: string, type: "success" | "error") => {
    openModal("alert", { message, type });
  };

  return (
    <div className="flex bg-primary items-center justify-center h-screen pb-20">
      {modalState.type === "login" && (
        <AuthModal
          onClose={closeModal}
          onLogin={onLogin} // Triggered after success acknowledgment
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
      <div className="flex flex-col items-center justify-center bg-primary p-8 pb-20">
        <h1 className="text-4xl font-bold mb-4 text-primary-headerText">
          Welcome to Wave-Chopper
        </h1>
        <p className="text-lg text-center text-primary-bodyText max-w-2xl">
          Your ultimate tool for slicing, dicing, and crafting unique creations
          from your WAV files. Maintain the pristine quality of your lossless
          digital audio while unleashing your creative potential. It's time to
          turn your sound into something extraordinary in seconds.
        </p>
        <button
          className="p-4 mt-8 bg-primary-headerText rounded text-primary-headerBG text-lg md:text-2xl font-semibold hover:text-primary-bodyText"
          onClick={() => openModal("login")}
        >
          Login / Signup
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
