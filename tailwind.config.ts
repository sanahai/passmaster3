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
          DEFAULT: "#236BFF",
          light: "#0F49C2",
          pale: "#E8F1FF",
          accent: "#01B3FF",
        },
        beauty: {
          bg: "#F2F6FF",
          success: "#2E7D32",
          danger: "#C62828",
          neutral: "#14223A",
          gray: "#5F7092",
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
        card: "16px",
        btn: "10px",
      },
      boxShadow: {
        card: "0 8px 32px rgba(24, 56, 118, 0.12)",
        cardHover: "0 12px 40px rgba(24, 56, 118, 0.16)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.96)" },
          "60%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        pop: "pop 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
