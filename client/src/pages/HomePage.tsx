import React from "react";

const HomePage: React.FC = () => {
  // Home Page once logged in
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary pb-[125px]">
      <h1 className="text-4xl font-bold mb-4 text-primary-headerText">
        Our Vision
      </h1>
      <p className="text-lg text-center text-primary-bodyText max-w-2xl">
        Here at waveChopper, we’re always working on the next big effect to push
        the boundaries of what’s possible with your audio. We are dedicated to
        regularly releasing new and innovative tools for your use. Stay tuned
        for exciting updates as we bring your audio transformations to the next
        level.
      </p>
    </div>
  );
};

export default HomePage;
