/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ffc121",
          soft: "#ffc73a",
          light: "#ffd560",
          deep: "#f5b000",
        },
        ink: "#141414",
        black: "#2b2b2b",
        white: "#f2f2f2",
        cream: "#fbf7ee",
        paper: "#ffffff",
        muted: "#5c5546",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        site: "80rem",
      },
    },
  },
  plugins: [],
};
