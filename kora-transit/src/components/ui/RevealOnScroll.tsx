"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, VIEWPORT } from "@/lib/animations";

/** Framer Motion wrapper that reveals its children once when scrolled into view. */
export function RevealOnScroll({
  children,
  className,
  variants = fadeUp,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
}
