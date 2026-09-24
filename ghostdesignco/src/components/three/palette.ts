import * as THREE from "three";

/**
 * The world's colours. "night" is the 3D site as it is. "warm" is the warm
 * night preview (/nuit-chaude): espresso blacks, an ember light at the
 * horizon, in the floor and under the ghost, warm dust; the acid green stays
 * on the ghost and on everything you act on.
 */
export type PaletteName = "night" | "warm";

export type WorldPalette = {
  /** sky, fog and the far floor */
  bg: string;
  /** the floor's own colour (linear rgb) */
  floor: [number, number, number];
  /** the blueprint grid (linear rgb) */
  grid: [number, number, number];
  /** the slow rings of light under the ghost */
  rings: string;
  /** haze at the vanishing point: inner, middle and outer stops, opacity */
  horizon: [string, string, string, number];
  /** dust motes */
  dust: string;
  /** light of the big studio panels, and the light from below */
  key: string;
  under: string;
  /** a dark prop's material (the offers' plinth) */
  prop: string;
  /** the light version of the ghost: its see-through glass takes the sky's
   *  colour, so it glows a little more on a warm sky to stay green */
  ghostGlow: string;
  ghostOpacity: number;
};

// the grid of the 3D site: acid, 40 % towards a pale sage (as the floor shader had it)
const acid = new THREE.Color("#b6ff3b");
const sage = new THREE.Color().setRGB(0.62, 0.68, 0.6);
const nightGrid = acid.clone().lerp(sage, 0.4);

export const PALETTES: Record<PaletteName, WorldPalette> = {
  night: {
    bg: "#050505",
    floor: [0.006, 0.0062, 0.0068],
    grid: [nightGrid.r, nightGrid.g, nightGrid.b],
    rings: "#b6ff3b",
    horizon: ["rgba(182,255,59,0.3)", "rgba(182,255,59,0.05)", "rgba(182,255,59,0)", 0.2],
    dust: "#b6ff3b",
    key: "#ffffff",
    under: "#b6ff3b",
    prop: "#0b0b0b",
    ghostGlow: "#0f2403",
    ghostOpacity: 0.8,
  },
  warm: {
    bg: "#0e0a08",
    floor: [0.0105, 0.0072, 0.0056],
    grid: [0.56, 0.35, 0.19],
    rings: "#ff8a4c",
    horizon: ["rgba(255,138,76,0.36)", "rgba(242,87,34,0.08)", "rgba(242,87,34,0)", 0.28],
    dust: "#ffb070",
    // the studio panels stay white: the ghost keeps its true green
    key: "#ffffff",
    under: "#ff7a3d",
    prop: "#17110d",
    ghostGlow: "#2f6a0c",
    ghostOpacity: 0.88,
  },
};
