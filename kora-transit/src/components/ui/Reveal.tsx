"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { VIEWPORT, fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

/** Scroll-reveal wrapper. Animates once when entering the viewport. */
export function Reveal({
  children,
  variants = fadeUp,
  className,
  delay,
}: {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={delay ? { delay } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Staggered group — children should use `staggerItem` variants. */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
