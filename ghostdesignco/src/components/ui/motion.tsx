"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** Reveals replay each time a block re-enters the viewport. */
export const VIEW = { once: false, amount: 0.35 } as const;

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/**
 * Mask reveal: the clipping wrapper owns the in-view trigger (a child pushed
 * out of an overflow-hidden box never intersects), the inner line slides up.
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
      <motion.span
        className={cx(inline ? "inline-block" : "block", innerClassName)}
        variants={{
          hidden: { y: "110%" },
          show: { y: "0%", transition: { duration: 1.1, delay, ease: EXPO } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/**
 * Soft rise with de-blur. Glass panels pass `blur={false}`: a CSS filter on
 * the panel or an ancestor would cut its backdrop blur off the 3D behind.
 */
export function Rise({
  children,
  delay = 0,
  className,
  as = "div",
  blur = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "li";
  blur?: boolean;
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={blur ? { opacity: 0, y: 26, filter: "blur(8px)" } : { opacity: 0, y: 26 }}
      whileInView={blur ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 1, delay, ease: EXPO }}
    >
      {children}
    </Comp>
  );
}

/** Number that counts up when it enters the viewport (and again on return). */
export function Counter({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    const c = animate(0, to, { duration: 1.8, ease: EXPO, onUpdate: (v) => setValue(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
