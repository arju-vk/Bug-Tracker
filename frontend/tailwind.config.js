/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#0f172a", // Main background
          800: "#1e293b", // Card background
          700: "#334155", // Borders
          600: "#475569", // Muted text
          500: "#64748b", // Placeholder
          400: "#94a3b8", // Secondary text
          300: "#cbd5e1", // Primary text
          200: "#e2e8f0", // Headings
          100: "#f1f5f9", // Bright text
        },
        accent: {
          violet: "#8b5cf6", // Primary actions
          emerald: "#10b981", // Success/Done
          amber: "#f59e0b", // Medium/Warning
          rose: "#f43f5e", // Critical/Error
          sky: "#0ea5e9", // Info/Links
        },
      },
    },
  },
  plugins: [],
};
