"use client";

import { useEffect, type RefObject } from "react";

/**
 * Writes --p (0 to 1) on the element while it crosses the screen: 0 when its
 * top reaches `from` (a fraction of the screen height), 1 when its bottom
 * reaches `to`. Only listens while the element is near the screen.
 */
export function useScrollProgress(ref: RefObject<HTMLElement>, from = 0.85, to = 0.5, onChange?: (p: number) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      onChange?.(1);
      return;
    }
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * from - r.top) / (r.height + vh * (from - to))));
      if (Math.abs(p - last) > 0.001) {
        last = p;
        el.style.setProperty("--p", p.toFixed(4));
        onChange?.(p);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
          update();
        } else {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
          update();
        }
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    el.style.setProperty("--p", "0");
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, from, to]);
}
