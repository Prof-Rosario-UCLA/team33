/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6B8E23", // Olive Green
        secondary: "#D89A64", // Terracotta
        background: "#F9F6F0", // Linen
        accent: "#FFCBA4", // Peach
        alert: "#B7410E", // Brick Red
      },
    },
  },
  plugins: [],
};
