"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { EXPO, VIEW, lineUp } from "@/lib/motion";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/**
 * Mask reveal: the clipping wrapper owns the in-view trigger, the inner span
 * slides up through it (see `lineUp`).
 */
export function Mask({
  children,
  delay = 0,
  inline = false,
  className,
  innerClassName,
}: {
  children: ReactNode;
  delay?: number;
  inline?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <motion.span
      className={cx(inline ? "inline-block align-top" : "block", "overflow-hidden", className)}
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
    >
      <motion.span className={cx(inline ? "inline-block" : "block", innerClassName)} variants={lineUp} custom={delay}>
        {children}
      </motion.span>
    </motion.span>
  );
}

/** Mockup line breaks on the desktop stage, flowing text below it. */
export function Lines({ lines, lineClassName }: { lines: string[]; lineClassName?: string }) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={i} className={cx("xl:block", lineClassName)}>
          {l}
          {i < lines.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

/**
 * Hairline that draws itself when it scrolls into view. The in-view trigger
 * sits on the untransformed wrapper: a line collapsed to scale 0 far
 * off-screen would never intersect the viewport.
 */
export function Hairline({
  dir = "x",
  className,
  style,
  delay = 0,
  from = "start",
  tone = "bg-white/[0.13]",
}: {
  dir?: "x" | "y";
  className?: string;
  style?: CSSProperties;
  delay?: number;
  from?: "start" | "end" | "center";
  /** Background utility of the drawn line. */
  tone?: string;
}) {
  const reduce = useReducedMotion();
  const origin =
    dir === "x"
      ? from === "start" ? "left" : from === "end" ? "right" : "center"
      : from === "start" ? "top" : from === "end" ? "bottom" : "center";
  const variants = {
    hidden: dir === "x" ? { scaleX: 0 } : { scaleY: 0 },
    show: {
      ...(dir === "x" ? { scaleX: 1 } : { scaleY: 1 }),
      transition: reduce ? { duration: 0 } : { duration: 1.4, delay, ease: EXPO },
    },
  };
  return (
    <motion.span
      aria-hidden
      className={cx("pointer-events-none block", dir === "x" ? "h-px" : "w-px", className)}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0 }}
    >
      <motion.span className={cx("absolute inset-0 block", tone)} style={{ transformOrigin: origin }} variants={variants} />
    </motion.span>
  );
}

/** Small glowing node at a grid intersection. */
export function Node({ className, style, delay = 0 }: { className?: string; style?: CSSProperties; delay?: number }) {
  // Centring lives on the static wrapper: motion's transform would override it.
  return (
    <span
      aria-hidden
      className={cx("pointer-events-none absolute block h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2", className)}
      style={style}
    >
      <motion.span
        className="block h-full w-full rounded-full bg-white/80 shadow-[0_0_10px_2px_rgba(255,255,255,0.35)]"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay }}
      />
    </span>
  );
}

const GLYPHS = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯабвгдежзиклмнопрстуфхцчшэюя0123456789[]/_";

/**
 * Decoding text effect: characters resolve left to right.
 * The real string is always present for assistive tech.
 */
export function Scramble({
  text,
  delay = 0,
  duration = 900,
  className,
}: {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
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

/**
 * Thin orange square brackets framing their (relative) parent: they open
 * outwards from the text when it scrolls into view. Offsets are plain pixel
 * numbers: framer-motion cannot re-read a non-px transform (e.g. "em") when a
 * replaying in-view animation is interrupted, which throws inside its loop.
 */
export function BracketArms({ delay = 0.5 }: { delay?: number }) {
  const arm =
    "pointer-events-none absolute inset-y-0 w-[0.55em] border-y-[1.5px] border-ember xl:w-[calc(var(--u)*24)] xl:border-y-2";
  return (
    <>
      <motion.span
        aria-hidden
        className={cx(arm, "left-0 border-l-[1.5px] xl:border-l-2")}
        initial={{ x: 22, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={VIEW}
        transition={{ duration: 1.1, delay, ease: EXPO }}
      />
      <motion.span
        aria-hidden
        className={cx(arm, "right-0 border-r-[1.5px] xl:border-r-2")}
        initial={{ x: -22, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={VIEW}
        transition={{ duration: 1.1, delay, ease: EXPO }}
      />
    </>
  );
}
