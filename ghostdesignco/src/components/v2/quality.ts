import type { Tier } from "./HeroScene";

let gl2: boolean | undefined;

/** Is WebGL 2 there? Asked once for the page: the hero and the companion share the answer. */
export function hasWebGL2() {
  if (gl2 !== undefined) return gl2;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl2 = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    gl2 = false;
  }
  return gl2;
}

/**
 * The 3D site's rule: the full glass (and a real reflection) only on a
 * computer; phones and tablets always get the light version, which keeps
 * them smooth. ?ghost=hi|lo pins it (QA).
 */
export function pickTier(): Tier {
  const pinned = new URLSearchParams(window.location.search).get("ghost");
  if (pinned === "hi" || pinned === "lo") return pinned;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const wide = window.innerWidth >= 1024;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return fine && wide && cores >= 4 && memory >= 4 ? "hi" : "lo";
}

/** Sent once the hero's 3D is on screen: the companion may start then. */
export const HERO_READY = "v2-hero-ready";
