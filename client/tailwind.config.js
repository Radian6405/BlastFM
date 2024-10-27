/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "rgba(var(--text))",
        background: "rgba(var(--background))",
        primary: "rgba(var(--primary))",
        secondary: "rgba(var(--secondary))",
        accent: "rgba(var(--accent))",

        success: "#82dd55",
        error: "#e23636",
        warning: "#edb95e",
      },
    },
  },
  plugins: [],
};
