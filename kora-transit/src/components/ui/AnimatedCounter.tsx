"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { formatFr } from "@/lib/utils";

/** Counts up from 0 to `value` once it scrolls into view (easeOutCubic). */
export function AnimatedCounter({
  value,
  suffix = "",
  separator = false,
  duration = 1.8,
}: {
  value: number;
  suffix?: string;
  separator?: boolean;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {separator ? formatFr(display) : display}
      {suffix}
    </span>
  );
}
