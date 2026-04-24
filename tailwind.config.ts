import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#05070E",
          900: "#0A0F1F",
          800: "#111831",
          700: "#1A2347",
          600: "#25305F"
        },
        gold: {
          DEFAULT: "#F5C518",
          soft: "#FFD84D",
          dark: "#C99A00"
        },
        red: {
          accent: "#E63946",
          deep: "#B5222E"
        }
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        display: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"]
      },
      boxShadow: {
        card: "0 8px 24px -10px rgba(0,0,0,0.45)",
        gold: "0 0 0 1px rgba(245,197,24,0.25), 0 10px 30px -12px rgba(245,197,24,0.25)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;
