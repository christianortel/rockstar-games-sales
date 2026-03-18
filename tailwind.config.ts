import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 30%), linear-gradient(180deg, rgba(12,10,8,0.08), rgba(12,10,8,0.72))"
      },
      boxShadow: {
        panel: "0 20px 80px rgba(0,0,0,0.35)",
        glow: "0 0 80px rgba(255,163,73,0.18)"
      },
      fontFamily: {
        display: ['\"Arial Black\"', '\"Franklin Gothic Heavy\"', "sans-serif"],
        sans: ['\"Trebuchet MS\"', '\"Segoe UI\"', "sans-serif"],
        serif: ['\"Palatino Linotype\"', '\"Book Antiqua\"', "serif"]
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(0,-1.2rem,0) scale(1.02)" }
        },
        pulseBar: {
          "0%, 100%": { opacity: "0.82" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
        pulseBar: "pulseBar 2.6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
