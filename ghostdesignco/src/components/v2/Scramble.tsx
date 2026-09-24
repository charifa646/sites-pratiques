"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

/** Text that settles letter by letter out of random glyphs when it comes into view. */
export function Scramble({ text, delay = 0, duration = 900, className }: { text: string; delay?: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.6 });
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView || reduce) {
      setOut(text);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now + delay * 1000;
      const t = Math.max(0, now - start) / duration;
      const settled = Math.floor(t * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < settled || ch === " " || ch === "[" || ch === "]") s += ch;
        else s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text, delay, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{out}</span>
    </span>
  );
}
