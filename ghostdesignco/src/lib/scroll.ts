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

const inOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
let tween = 0;

/**
 * Animated scroll to a page offset. Lenis drives it on desktop; touch devices
 * (native scroll) get a small rAF tween. Instant when motion is reduced.
 */
export function scrollToY(
  y: number,
  { duration = 1.6, easing = inOutCubic, onComplete }: { duration?: number; easing?: (t: number) => number; onComplete?: () => void } = {},
) {
  cancelScroll();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const d = reduce ? 0 : duration;
  if (lenis) {
    lenis.scrollTo(y, { duration: d, easing, immediate: d === 0, force: true, onComplete: () => onComplete?.() });
    if (d === 0) onComplete?.();
    return;
  }
  const from = window.scrollY;
  if (d === 0 || Math.abs(y - from) < 1) {
    window.scrollTo(0, y);
    onComplete?.();
    return;
  }
  const t0 = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / (d * 1000));
    window.scrollTo(0, from + (y - from) * easing(k));
    if (k < 1) tween = requestAnimationFrame(step);
    else {
      tween = 0;
      onComplete?.();
    }
  };
  tween = requestAnimationFrame(step);
}

/** Stops a running scrollToY (the page stays where it is). */
export function cancelScroll() {
  if (tween) cancelAnimationFrame(tween);
  tween = 0;
  if (lenis?.isScrolling === "smooth") lenis.scrollTo(lenis.scroll, { immediate: true, force: true });
}

/** Page offset and pinned length of a station (0 when it is missing). */
export function stationSpan(id: string) {
  const s = scrollState.stations.find((st) => st.id === id);
  if (!s) return { top: 0, range: 0 };
  return { top: s.top, range: Math.max(0, s.height - scrollState.vh) };
}

/** How long a dive lasts, in seconds (/pose sets a calmer pace while it is on screen). */
export const dive = { duration: 2.6 };

/** Cinematic scroll to a section (the "dive"); instant when motion is reduced. */
export function diveTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis && !reduce) {
    lenis.scrollTo(el, {
      duration: dive.duration,
      easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    });
  } else {
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
}
