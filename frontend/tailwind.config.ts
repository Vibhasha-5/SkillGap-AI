import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        bg: "#080B0F",
        surface: "#0D1117",
        border: "#1C2333",
        accent: "#00E5FF",
        accent2: "#7C3AED",
        accent3: "#10B981",
        warn: "#F59E0B",
        danger: "#EF4444",
        muted: "#4B5563",
        text: "#E2E8F0",
        dim: "#94A3B8",
      },
      animation: {
        "scan": "scan 3s linear infinite",
        "flicker": "flicker 0.15s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "glitch": "glitch 2s infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
        "draw": "draw 1.5s ease forwards",
        "blink": "blink 1s step-end infinite",
        "grid-move": "gridMove 20s linear infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        glitch: {
          "0%,100%": { transform: "translate(0)", clipPath: "none" },
          "20%": { transform: "translate(-2px, 2px)", clipPath: "polygon(0 20%, 100% 20%, 100% 40%, 0 40%)" },
          "40%": { transform: "translate(2px, -2px)", clipPath: "polygon(0 60%, 100% 60%, 100% 80%, 0 80%)" },
          "60%": { transform: "translate(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        draw: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        gridMove: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "40px 40px" },
        },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
