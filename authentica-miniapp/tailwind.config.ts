import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-sf)", "system-ui", "sans-serif"],
        default: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        // Fade up and down
        "fade-up": "fade-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards",
        "fade-down": "fade-down 0.5s",
        // Tooltip
        "slide-up-fade": "slide-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        // Adding new animations
        title: "title-appear 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards",
        "title-slow": "title-appear 3s cubic-bezier(0.23, 1, 0.32, 1) forwards",
        cursor: "cursor-blink 1s infinite",
        "spin-slow": "spin-slow 12s linear infinite",
      },
      keyframes: {
        // Fade up and down
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "80%": {
            opacity: "0.6",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "80%": {
            opacity: "0.6",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
        // Tooltip
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down-fade": {
          "0%": { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "title-appear": {
          "0%": {
            opacity: "0",
            transform: "scale(0.96) translateY(10px)",
          },
          "50%": {
            opacity: "0.5",
            transform: "scale(0.98) translateY(5px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },
        "cursor-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      colors: {
        background: "#f8fafc",
        foreground: "#020617",
        primary: {
          DEFAULT: "#4f46e5", // indigo-600
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#a855f7", // purple-500
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#0ea5e9", // sky-500
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9", // slate-100
          foreground: "#64748b", // slate-500
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#020617",
        },
      },
    },
  },
};

export default config;
