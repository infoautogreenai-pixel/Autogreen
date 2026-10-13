/** @type {import('tailwindcss').Config} */

// =============================================
// Tailwind CSS Configuration File
// =============================================
// This file tells Tailwind CSS:
// 1. Where to look for class names (content)
// 2. Custom colors, fonts, etc. (theme)
// 3. Any extra plugins we want to use

const config = {
  // Tell Tailwind which files to scan for class names
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Enable dark mode using a CSS class (e.g., <html class="dark">)
  darkMode: "class",

  theme: {
    extend: {
      // Custom colors used throughout the app
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Brand green color palette (light to dark shades)
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },

        // AutoGreen theme colors (used for dark UI styling)
        autogreen: {
          emerald: "#10b981",
          mint: "#00f59b",
          bright: "#34d399",
          deep: "#020617",
          darkgreen: "#051311",
          card: "#091614",
          border: "rgba(16, 185, 129, 0.18)",
        },

        // Accent colors (golden/amber for highlights)
        accent: {
          500: "#f59e0b",
          600: "#d97706",
        },
      },

      // Custom font families: Poppins for body, sans, headings & paragraphs
      fontFamily: {
        poppins: ["'Poppins'", "sans-serif"],
        heading: ["'Poppins'", "'PT Sans'", "sans-serif"],
        sans: ["'Poppins'", "sans-serif"],
        body: ["'Poppins'", "sans-serif"],
      },

      // Extended container max-widths
      maxWidth: {
        "7xl": "100rem",
        "8xl": "100rem",
      },
    },
  },

  // No extra plugins needed right now
  plugins: [],
};

export default config;
