/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          300: "#3E7F78",
          400: "#2E6862",
          500: "#12504A",
          600: "#0C3F3B",
          700: "#0A3734",
        },
      },
    },
  },
  plugins: [],
};
