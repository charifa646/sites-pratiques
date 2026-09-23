"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EXPO } from "@/lib/motion";
import { STAGE_H, STAGE_W } from "@/lib/stage";
import { cx } from "./primitives";

export type Rect = { x: number; y: number; w: number; h: number };
export type Segment = [number, number, number, number];

/** Unique edges of a set of cells (shared borders are drawn once). */
export function edgesOf(rects: Rect[]): Segment[] {
  const H = new Map<number, [number, number][]>();
  const V = new Map<number, [number, number][]>();
  const push = (m: Map<number, [number, number][]>, k: number, v: [number, number]) => {
    const list = m.get(k) ?? [];
    list.push(v);
    m.set(k, list);
  };
  for (const r of rects) {
    push(H, r.y, [r.x, r.x + r.w]);
    push(H, r.y + r.h, [r.x, r.x + r.w]);
    push(V, r.x, [r.y, r.y + r.h]);
    push(V, r.x + r.w, [r.y, r.y + r.h]);
  }
  const merge = (list: [number, number][]) => {
    const s = [...list].sort((a, b) => a[0] - b[0]);
    const out: [number, number][] = [];
    for (const iv of s) {
      const last = out[out.length - 1];
      if (last && iv[0] <= last[1]) last[1] = Math.max(last[1], iv[1]);
      else out.push([iv[0], iv[1]]);
    }
    return out;
  };
  const segs: Segment[] = [];
  H.forEach((list, y) => merge(list).forEach(([a, b]) => segs.push([a, y, b, y])));
  V.forEach((list, x) => merge(list).forEach(([a, b]) => segs.push([x, a, x, b])));
  // Draw order: top-left first, so the grid "constructs" itself diagonally.
  return segs.sort((p, q) => p[0] + p[1] - (q[0] + q[1]));
}

export function GridOverlay({
  segments,
  className,
  stroke = "rgba(255,255,255,0.26)",
  delay = 0,
}: {
  segments: Segment[];
  className?: string;
  stroke?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <svg
      aria-hidden
      className={cx("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      preserveAspectRatio="none"
    >
      {segments.map(([x1, y1, x2, y2], i) => (
        <motion.line
          key={`${x1}-${y1}-${x2}-${y2}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={stroke}
          strokeWidth={1.35}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1.3, delay: delay + i * 0.04, ease: EXPO }}
        />
      ))}
    </svg>
  );
}
