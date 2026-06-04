import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0B1628", light: "#111F35", deep: "#070F1C" },
        surface: "#111F35",
        line: "#1E2E45",
        gold: { DEFAULT: "#C9A84C", soft: "#E0C674", deep: "#A8842F" },
        ink: "#F5F5F0",
        muted: "#A0A8B8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      letterSpacing: { tightest: "-0.04em", tighter2: "-0.02em" },
      boxShadow: {
        gold: "0 0 70px -14px rgba(201,168,76,0.5)",
        "gold-sm": "0 0 34px -10px rgba(201,168,76,0.45)",
        card: "0 28px 70px -28px rgba(0,0,0,0.65)",
      },
      keyframes: {
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.07)" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        aurora: {
          "0%, 100%": { transform: "translate3d(-8%, -4%, 0) rotate(0deg)" },
          "50%": { transform: "translate3d(8%, 6%, 0) rotate(8deg)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "light-sweep": {
          "0%": { transform: "translateX(-120%) skewX(-12deg)", opacity: "0" },
          "30%": { opacity: "0.7" },
          "100%": { transform: "translateX(220%) skewX(-12deg)", opacity: "0" },
        },
        "speed-line": {
          "0%": { transform: "translateX(-110%)", opacity: "0" },
          "12%": { opacity: "1" },
          "85%": { opacity: "1" },
          "100%": { transform: "translateX(120vw)", opacity: "0" },
        },
      },
      animation: {
        "gradient-pan": "gradient-pan 12s ease infinite",
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 2.6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 6s ease-in-out infinite",
        "spin-slow": "spin-slow 34s linear infinite",
        aurora: "aurora 18s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "light-sweep": "light-sweep 7s ease-in-out infinite",
        "speed-line": "speed-line 4.5s cubic-bezier(0.45,0,0.2,1) infinite",
        "speed-line-slow": "speed-line 6.5s cubic-bezier(0.45,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
