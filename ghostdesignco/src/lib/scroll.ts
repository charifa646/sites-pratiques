import type Lenis from "lenis";

/**
 * Shared scroll state for the DOM and the WebGL world.
 * Stations are the page sections the camera travels through, in page order.
 * Measurements are refreshed on resize; the scroll position is read live.
 */
export type Station = { id: string; top: number; height: number };

export const scrollState = {
  y: 0,
  vh: 1,
  stations: [] as Station[],
  /** Scroll velocity in viewports per second (smoothed). */
  velocity: 0,
};

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};

export function measureStations() {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));
  const y = window.scrollY;
  scrollState.stations = els.map((el) => {
    const r = el.getBoundingClientRect();
    return { id: el.dataset.station!, top: r.top + y, height: r.height };
  });
  scrollState.vh = window.innerHeight;
}

/** Cinematic scroll to a section (the "dive"); instant when motion is reduced. */
export function diveTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis && !reduce) {
    lenis.scrollTo(el, {
      duration: 2.6,
      easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    });
  } else {
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
}
