import type { Tier } from "./HeroScene";

let gl2: boolean | undefined;

/**
 * Is WebGL 2 there, on a real graphics chip? Asked once for the page: the
 * hero and the companion share the answer. Without one (a software renderer:
 * test machines such as PageSpeed's, some old computers), the 3D would be
 * drawn by the processor frame after frame and freeze the page, so they keep
 * the still pictures. ?3d=on forces the 3D anyway (QA).
 */
export function hasWebGL2() {
  if (gl2 !== undefined) return gl2;
  const force = new URLSearchParams(window.location.search).get("3d") === "on";
  try {
    const gl = document.createElement("canvas").getContext("webgl2", force ? undefined : { failIfMajorPerformanceCaveat: true });
    let soft = false;
    if (gl && !force) {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
      soft = /swiftshader|llvmpipe|softpipe|software/i.test(renderer);
    }
    gl2 = Boolean(gl) && !soft;
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
