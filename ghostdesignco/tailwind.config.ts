import type { Config } from "tailwindcss";

/**
 * Ghostdesignco tokens: near-black space, one acid green signature.
 * acid = the brand accent (buttons, highlights, glow), acid-deep = its shadow
 * side for gradients and pressed states.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: { DEFAULT: "#050505", 900: "#080808", 800: "#0d0d0d", 700: "#141414", 600: "#1c1c1c" },
        bone: "#EDEDEA",
        fog: { DEFAULT: "#9A9A96", dim: "#6E6E6A" },
        acid: { DEFAULT: "#B6FF3B", deep: "#7ED321", ink: "#0B1400" },
      },
      fontFamily: {
        sans: ["var(--font-dm)", "system-ui", "sans-serif"],
        display: ["var(--font-clash)", "var(--font-dm)", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
