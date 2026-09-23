import type { Transition, Variants } from "framer-motion";

export const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const INOUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

/** Reveals replay every time a block re-enters the viewport. */
export const VIEW = { once: false, amount: 0.3 } as const;

export const rise: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, delay: d, ease: EXPO },
  }),
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: (d: number = 0) => ({ opacity: 1, transition: { duration: 0.9, delay: d, ease: "easeOut" } }),
};

/**
 * Line-by-line mask reveal. The in-view trigger must live on the clipping
 * parent: a child translated out of an overflow-hidden box is fully clipped,
 * so IntersectionObserver would never report it as visible.
 */
export const lineUp: Variants = {
  hidden: { y: "110%" },
  show: (d: number = 0) => ({ y: "0%", transition: { duration: 1, delay: d, ease: EXPO } }),
};

export const spring: Transition = { type: "spring", stiffness: 100, damping: 20 };
