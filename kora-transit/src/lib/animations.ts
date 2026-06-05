import type { Variants } from "framer-motion";

/** Signature easing for the whole site (premium, controlled). */
export const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

/**
 * Reveal viewport config — replays each time the element enters the viewport
 * (once: false) so scroll-in animations repeat. Triggers a bit before fully in.
 */
export const VIEWPORT = { once: false, margin: "-90px", amount: 0.2 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -56 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 56 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

/** Parent container that staggers its children on reveal. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.08 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
