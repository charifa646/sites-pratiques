import * as THREE from "three";
import { scrollState } from "@/lib/scroll";

/**
 * The dive path. Every page section with a `data-station` owns a camera pose
 * and a spot for the ghost guide. While a section is pinned the camera holds
 * its pose; during the last viewport of the section it travels to the next one.
 */
type V3 = [number, number, number];
export type Pose = { cam: V3; look: V3; ghost: V3; gs: number };

export const FLOOR_Y = -1.6;

// Landscape screens (lg and up): text on one side, 3D on the other.
const WIDE: Record<string, Pose> = {
  hero: { cam: [0, 0.1, 9.5], look: [0, -0.45, 0], ghost: [2.85, 0.14, 0.6], gs: 0.9 },
  proof: { cam: [0, 0.5, -19], look: [0, 0.5, -31], ghost: [4.45, -0.52, -30], gs: 0.8 },
  problem: { cam: [0, 0.25, -41], look: [0, 0.2, -53], ghost: [3.35, 1.02, -52.9], gs: 0.78 },
  "offer-1": { cam: [0, 0.3, -63], look: [0, 0.3, -75], ghost: [0.35, -0.6, -71], gs: 0.62 },
  "offer-2": { cam: [0, 0.3, -83], look: [0, 0.3, -95], ghost: [-0.35, 1.35, -91], gs: 0.6 },
  "offer-3": { cam: [0, 0.3, -103], look: [0, 0.3, -115], ghost: [0.35, -0.6, -111], gs: 0.62 },
  work: { cam: [0, 0.35, -125], look: [0.4, 0.25, -137], ghost: [0.4, -0.72, -131.5], gs: 0.46 },
  voices: { cam: [0, 0.45, -147], look: [0, 0.1, -159], ghost: [-3.35, -0.8, -156.5], gs: 0.44 },
  method: { cam: [0, 0.25, -169], look: [0, 0.2, -181], ghost: [1.05, 1.55, -179.6], gs: 0.46 },
  pricing: { cam: [0, 0.3, -191], look: [0, 0.25, -203], ghost: [0.55, -0.85, -198.5], gs: 0.52 },
  faq: { cam: [0, 0.35, -211], look: [0, 0.3, -223], ghost: [3.7, 0.15, -221], gs: 0.72 },
  contact: { cam: [0, 0.6, -231], look: [0, 0.3, -248], ghost: [-3.5, -0.9, -241.5], gs: 0.5 },
};

// Portrait and small screens: 3D in the upper part, text below.
const TALL: Record<string, Pose> = {
  hero: { cam: [0, 0.25, 10.5], look: [0, 0.25, 0], ghost: [0, 3.57, 0.2], gs: 0.75 },
  proof: { cam: [0, 0.5, -18], look: [0, 0.5, -31], ghost: [1.83, -0.14, -29], gs: 0.55 },
  problem: { cam: [0, 0.25, -40], look: [0, 0.25, -53], ghost: [0.9, 5.4, -52.8], gs: 0.55 },
  // peeks over the middle page of the fan
  "offer-1": { cam: [0, 0.3, -62], look: [0, 0.3, -75], ghost: [0.35, 5.3, -75.8], gs: 0.5 },
  "offer-2": { cam: [0, 0.3, -82], look: [0, 0.3, -95], ghost: [-1.95, 2.5, -94.4], gs: 0.5 },
  "offer-3": { cam: [0, 0.3, -102], look: [0, 0.3, -115], ghost: [1.95, 2.5, -114.4], gs: 0.5 },
  work: { cam: [0, 0.3, -124], look: [0, 0.3, -137], ghost: [1.7, 5.45, -135.4], gs: 0.4 },
  voices: { cam: [0, 0.4, -146], look: [0, 0.4, -159], ghost: [0, 3.64, -156], gs: 0.5 },
  method: { cam: [0, 0.25, -168], look: [0, 0.25, -181], ghost: [-0.9, 5.4, -180.8], gs: 0.55 },
  pricing: { cam: [0, 0.3, -190], look: [0, 0.3, -203], ghost: [1.75, 2.6, -199.5], gs: 0.45 },
  // the FAQ scrolls over the whole screen: the guide goes ahead to the form
  faq: { cam: [0, 0.35, -210], look: [0, 0.35, -223], ghost: [0, 2.2, -246], gs: 0.6 },
  // on phones the guide follows the form (see Ghost), this is where it waits
  contact: { cam: [0, 0.6, -230], look: [0, 0.6, -248], ghost: [1.2, 3.2, -236], gs: 0.32 },
};

/** Where the set pieces stand, per layout (the portal only uses its depth: it follows the form). */
export const PROPS = {
  wide: {
    browser: [3.0, 0.0, -52] as V3,
    browserScale: 1,
    mockups: [
      [3.35, 0.2, -74.5],
      [-3.35, 0.2, -94.5],
      [3.35, 0.2, -114.5],
    ] as V3[],
    mockupScale: [1, 1, 1],
    gallery: [2.85, 0.35, -137.5] as V3,
    galleryScale: 1,
    method: [3.0, 0.0, -180] as V3,
    methodScale: 1,
    quote: [3.35, 0.25, -202.5] as V3,
    quoteScale: 1,
    portal: [0, 0, -238] as V3,
  },
  tall: {
    browser: [0, 4.15, -52] as V3,
    browserScale: 0.78,
    mockups: [
      [0, 3.75, -75],
      [0, 3.0, -95],
      [0, 3.0, -115],
    ] as V3[],
    mockupScale: [1.08, 1.28, 1.24],
    gallery: [0, 3.85, -137] as V3,
    galleryScale: 1,
    method: [0, 4.15, -180] as V3,
    methodScale: 0.78,
    quote: [0, 3.6, -202] as V3,
    quoteScale: 0.85,
    portal: [0, 0, -235] as V3,
  },
};

/** Gates: Figma frames the camera flies through just before each station. */
export const GATES = [
  { z: -16, label: "02 · En chiffres" },
  { z: -38, label: "03 · Le constat" },
  { z: -60, label: "04 · Sites vitrines" },
  { z: -80, label: "05 · Landing pages" },
  { z: -100, label: "06 · Pages de vente" },
  { z: -122, label: "07 · Réalisations" },
  { z: -144, label: "08 · Témoignages" },
  { z: -166, label: "09 · Méthode" },
  { z: -188, label: "10 · Tarifs" },
  { z: -208, label: "11 · Questions" },
  { z: -228, label: "12 · Contact" },
];

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const smooth = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

export type Sample = {
  cam: THREE.Vector3;
  look: THREE.Vector3;
  ghost: THREE.Vector3;
  gs: number;
  /** index of the station we are leaving and travel fraction to the next */
  index: number;
  travel: number;
};

export function createSample(): Sample {
  const p = WIDE.hero;
  return {
    cam: new THREE.Vector3(...p.cam),
    look: new THREE.Vector3(...p.look),
    ghost: new THREE.Vector3(...p.ghost),
    gs: p.gs,
    index: 0,
    travel: 0,
  };
}

/**
 * Pose for the current scroll position. With `cut` (reduced motion) the
 * camera does not fly: it switches station halfway through the transition.
 */
export function sampleDive(out: Sample, tall: boolean, cut = false): Sample {
  const table = tall ? TALL : WIDE;
  const { y, vh, stations } = scrollState;
  if (!stations.length) {
    const p = table.hero;
    out.cam.set(...p.cam);
    out.look.set(...p.look);
    out.ghost.set(...p.ghost);
    out.gs = p.gs;
    out.index = 0;
    out.travel = 0;
    return out;
  }
  let i = 0;
  for (let k = 0; k < stations.length; k++) if (y >= stations[k].top - 1) i = k;
  const s = stations[i];
  const next = stations[Math.min(i + 1, stations.length - 1)];
  const start = s.top + Math.max(0, s.height - vh);
  const f = i === stations.length - 1 ? 0 : clamp01((y - start) / Math.max(1, vh));
  const e = cut ? (f < 0.5 ? 0 : 1) : easeInOut(f);
  const a = table[s.id] ?? table.hero;
  const b = table[next.id] ?? a;
  out.cam.copy(tmpA.set(...a.cam)).lerp(tmpB.set(...b.cam), e);
  out.look.copy(tmpA.set(...a.look)).lerp(tmpB.set(...b.look), e);
  out.ghost.copy(tmpA.set(...a.ghost)).lerp(tmpB.set(...b.ghost), e);
  out.gs = a.gs + (b.gs - a.gs) * e;
  out.index = i;
  out.travel = f;
  return out;
}

function station(id: string) {
  return scrollState.stations.find((st) => st.id === id);
}

/** Pinned progress (0 → 1) of a given station, used for in-section animations. */
export function stationProgress(id: string) {
  const s = station(id);
  if (!s) return 0;
  return clamp01((scrollState.y - s.top) / Math.max(1, s.height - scrollState.vh));
}

/** 1 when the camera sits at the station, fading to 0 one station away. */
export function stationPresence(id: string) {
  const s = station(id);
  if (!s) return id === "hero" ? 1 : 0;
  const { y, vh } = scrollState;
  const enter = s.top - vh; // previous travel starts
  const hold = s.top;
  const leave = s.top + Math.max(0, s.height - vh);
  if (y < enter || y > leave + vh) return 0;
  if (y < hold) return clamp01((y - enter) / vh);
  if (y <= leave) return 1;
  return clamp01(1 - (y - leave) / vh);
}

/** Travel out of a station: 0 while it holds (or before), 0 → 1 while leaving, 1 after. */
export function stationLeave(id: string) {
  const s = station(id);
  if (!s) return 0;
  return clamp01((scrollState.y - (s.top + s.height - scrollState.vh)) / scrollState.vh);
}

/** Vertical field of view (radians) used by the camera for a layout and aspect ratio. */
export function baseFov(tall: boolean, aspect: number) {
  const deg = Math.PI / 180;
  if (tall) return Math.min(64 * deg, Math.max(30 * deg, 2 * Math.atan(Math.tan(15.5 * deg) / aspect)));
  return Math.max(35 * deg, 2 * Math.atan(Math.tan(29.3 * deg) / aspect));
}

/** Pose tables, read by pieces that frame themselves around a station's view. */
export const POSES = { wide: WIDE, tall: TALL };

/** Monotonic arrival: 0 before the camera heads to the station, 1 once there and after. */
export function stationReach(id: string) {
  const s = station(id);
  if (!s) return 0;
  return clamp01((scrollState.y - (s.top - scrollState.vh)) / scrollState.vh);
}

/** Live data other pieces of the world react to (written by the ghost). */
export const worldState = {
  ghost: new THREE.Vector3(0, 0, 0),
  ghostScale: 1,
  /** smoothed pointer, -1 → 1 on both axes (y down) */
  pointer: { x: 0, y: 0 },
  /** top-right corner of the portal frame (world), written by the portal */
  portalCorner: new THREE.Vector3(),
  portalReady: false,
};
