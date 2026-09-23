"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { measureStations, scrollState, setLenis } from "@/lib/scroll";

/** Which service the visitor picked before reaching the form. */
type Intent = { need: string | null; setNeed: (n: string | null) => void };
const IntentCtx = createContext<Intent>({ need: null, setNeed: () => {} });
export const useIntent = () => useContext(IntentCtx);

/**
 * App-wide providers. Lenis runs on precise pointers only (touch keeps native
 * scroll) and is created imperatively so the React tree never changes shape.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [need, setNeed] = useState<string | null>(null);
  const intent = useMemo(() => ({ need, setNeed }), [need]);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let raf = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();

    const loop = (time: number) => {
      lenis?.raf(time);
      // live scroll + smoothed velocity for the WebGL world
      const y = window.scrollY;
      const dt = Math.max(1, time - lastT);
      const v = ((y - lastY) / Math.max(1, scrollState.vh)) * (1000 / dt);
      scrollState.velocity += (v - scrollState.velocity) * 0.12;
      scrollState.y = y;
      lastY = y;
      lastT = time;
      raf = requestAnimationFrame(loop);
    };

    const sync = () => {
      const want = mq.matches && !reduce.matches;
      if (want && !lenis) {
        lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 });
        setLenis(lenis);
      } else if (!want && lenis) {
        lenis.destroy();
        lenis = null;
        setLenis(null);
      }
    };

    const onResize = () => measureStations();
    sync();
    measureStations();
    raf = requestAnimationFrame(loop);
    // fonts and late layout shift the sections: re-measure a few times
    const t1 = window.setTimeout(measureStations, 400);
    const t2 = window.setTimeout(measureStations, 1500);
    document.fonts?.ready.then(measureStations).catch(() => {});
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <IntentCtx.Provider value={intent}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </IntentCtx.Provider>
  );
}
