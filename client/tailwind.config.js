/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0e7c86",
          headerBG: "#006475",
          headerText: "#cb9a19",
          bodyText: "#F4F4F4",
        },
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', "serif"],
      },
    },
  },
  plugins: [],
};
