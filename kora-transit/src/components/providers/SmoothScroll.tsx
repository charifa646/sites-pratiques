"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Global smooth scroll (Lenis). Native scroll under the hood, so Framer
 * Motion's useScroll continues to work for scroll-linked animations.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: 1.2, smoothWheel: true, wheelMultiplier: 1 }}
    >
      {children}
    </ReactLenis>
  );
}
