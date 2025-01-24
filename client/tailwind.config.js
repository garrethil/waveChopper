/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', "serif"], // Add Roboto Mono as a custom font
      },
    },
  },
  plugins: [],
};
