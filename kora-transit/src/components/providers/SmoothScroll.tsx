"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Global smooth scroll (Lenis) on pointer-fine devices only. Touch devices use
 * native scroll — smoother and lighter on mobile. Framer Motion's useScroll
 * keeps working either way (Lenis drives native scroll under the hood).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const coarse =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    setEnabled(!coarse);
  }, []);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
