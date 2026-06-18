import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D81B60",
          light: "#E91E63",
          pale: "#FCE4EC",
          accent: "#FF4081",
        },
        beauty: {
          bg: "#FFF5F8",
          success: "#2E7D32",
          danger: "#C62828",
          neutral: "#424242",
          gray: "#757575",
        },
        b2b: {
          primary: "#0F172A",
          accent: "#E91E8C",
          teal: "#14B8A6",
          section: "#F1F5F9",
          border: "#E2E8F0",
          light: "#F8FAFC",
        },
      },
      fontFamily: {
        kr: ["Pretendard", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(216, 27, 96, 0.08)",
        cardHover: "0 8px 30px rgba(216, 27, 96, 0.15)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop": {
          "0%": { transform: "scale(0.96)" },
          "60%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "pop": "pop 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
