import React from "react";

const HomePage: React.FC = () => {
  // Home Page once logged in
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-primary p-8 pt-10">
      <h1 className="text-4xl font-bold mb-4 text-primary-headerText">
        Welcome to Wave-Chopper
      </h1>
      <p className="text-lg text-center text-primary-bodyText max-w-2xl">
        Your ultimate tool for slicing, dicing, and crafting unique creations
        from your WAV files. Maintain the pristine quality of your lossless
        digital audio while unleashing your creative potential. It's time to
        turn your sound into something extraordinary in seconds!
      </p>
    </div>
  );
};

export default HomePage;
