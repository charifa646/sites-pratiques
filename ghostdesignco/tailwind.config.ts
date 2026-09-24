import type { Config } from "tailwindcss";

/**
 * Ghostdesignco tokens: near-black space, one acid green signature.
 * acid = the brand accent (buttons, highlights, glow), acid-deep = its shadow
 * side for gradients and pressed states. The dark side (void, bone, fog) reads
 * CSS variables (globals.css) so a page can take another palette; the default
 * values are the site's.
 */
const tone = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: { DEFAULT: tone("void"), 900: tone("void-900"), 800: tone("void-800"), 700: tone("void-700"), 600: tone("void-600") },
        bone: tone("bone"),
        fog: { DEFAULT: tone("fog"), dim: tone("fog-dim") },
        acid: { DEFAULT: "#B6FF3B", deep: "#7ED321", ink: "#0B1400" },
        // V2 (light): warm paper, near-black ink, hairline borders
        paper: "#F4F3EE",
        ink: { DEFAULT: "#0C0C0D", soft: "#55544F", mute: "#8A8881" },
        line: "#E3E1D9",
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
