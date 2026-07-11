import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF7F27",
          dark: "#E56A10",
          light: "#FFF4EB",
          muted: "#FFB366",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(255, 127, 39, 0.08)",
        cardHover: "0 12px 40px rgba(255, 127, 39, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
