"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

/**
 * Lenis on precise pointers only; touch devices keep their native scroll.
 * Created imperatively so the React tree never changes shape: swapping a
 * wrapper after hydration would remount the whole page mid-animation.
 * MotionConfig makes every framer-motion reveal honour prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let raf = 0;

    const loop = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      const want = mq.matches && !reduce.matches;
      if (want && !lenis) {
        lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
        raf = requestAnimationFrame(loop);
      } else if (!want && lenis) {
        cancelAnimationFrame(raf);
        lenis.destroy();
        lenis = null;
      }
    };

    sync();
    mq.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
