import type { Config } from "tailwindcss";

/**
 * Tokens sampled from the MAKEDO mockup (3× upscaled crops, saturation search):
 * ember = the orange "E", ember-soft = orange headline text, lime = Figma handles.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#050505", 900: "#090909", 800: "#111111", 700: "#1A1A1A" },
        panel: "#2C2C2C",
        hair: "rgba(255,255,255,0.13)",
        paper: "#F2F2F2",
        mist: "#9C9C9C",
        smoke: "#8B8B8B",
        ember: { DEFAULT: "#F25722", soft: "#E0673F", deep: "#722509" },
        lime: "#7ED321",
        leaf: "#22AA39",
      },
      fontFamily: {
        sans: ["var(--font-exo)", "system-ui", "sans-serif"],
        display: ["var(--font-unbounded)", "var(--font-exo)", "sans-serif"],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        quint: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
