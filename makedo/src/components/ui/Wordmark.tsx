"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * MAKEDO wordmark, redrawn as geometry from the mockup (cap height = 100 units,
 * letter widths and gaps measured on a 2× crop). Strokes are unioned quads so
 * the letters stay razor sharp at any size. The E carries the brand orange.
 */

type Pt = [number, number];

const T = 16; // stem weight

function strokeQuad(a: Pt, b: Pt, t: number, extend = 12): Pt[] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy * (t / 2);
  const ny = ux * (t / 2);
  const a2: Pt = [a[0] - ux * extend, a[1] - uy * extend];
  const b2: Pt = [b[0] + ux * extend, b[1] + uy * extend];
  return [
    [a2[0] + nx, a2[1] + ny],
    [b2[0] + nx, b2[1] + ny],
    [b2[0] - nx, b2[1] - ny],
    [a2[0] - nx, a2[1] - ny],
  ];
}

/** Sutherland–Hodgman clip against an axis-aligned half plane. */
function clip(poly: Pt[], axis: 0 | 1, value: number, keepGreater: boolean): Pt[] {
  const out: Pt[] = [];
  const inside = (p: Pt) => (keepGreater ? p[axis] >= value : p[axis] <= value);
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const prev = poly[(i + poly.length - 1) % poly.length];
    const curIn = inside(cur);
    const prevIn = inside(prev);
    if (curIn !== prevIn) {
      const t = (value - prev[axis]) / (cur[axis] - prev[axis]);
      out.push([prev[0] + (cur[0] - prev[0]) * t, prev[1] + (cur[1] - prev[1]) * t]);
    }
    if (curIn) out.push(cur);
  }
  return out;
}

function box(poly: Pt[], x0: number, x1: number, y0 = 0, y1 = 100): Pt[] {
  let p = clip(poly, 1, y0, true);
  p = clip(p, 1, y1, false);
  p = clip(p, 0, x0, true);
  return clip(p, 0, x1, false);
}

/** Force clockwise winding so overlapping sub-paths union under nonzero fill. */
function cw(poly: Pt[]): Pt[] {
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    area += x1 * y2 - x2 * y1;
  }
  return area < 0 ? [...poly].reverse() : poly;
}

const r = (n: number) => Math.round(n * 100) / 100;

function path(polys: Pt[][], dx: number): string {
  return polys
    .map((poly) => cw(poly).map(([x, y], i) => `${i ? "L" : "M"}${r(x + dx)} ${r(y)}`).join("") + "Z")
    .join("");
}

const rect = (x: number, y: number, w: number, h: number): Pt[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

// Letter origins and widths (units) measured on the mockup at 1.18 px/unit.
const X = { M: 0, A: 151, K: 281, E: 394, D: 497, O: 613 } as const;
const W = { M: 136, K: 99, O: 118 } as const;
export const WORDMARK_WIDTH = 731;

const M = path(
  [
    rect(0, 0, T, 100),
    box(strokeQuad([8, 0], [W.M / 2, 100], 15.5), 0, W.M),
    box(strokeQuad([W.M - 8, 0], [W.M / 2, 100], 15.5), 0, W.M),
    rect(W.M - T, 0, T, 100),
  ],
  X.M,
);

const A = path(
  [
    [
      [0, 100],
      [57.5, -2.5],
      [115, 100],
      [96.5, 100],
      [57.5, 31],
      [18.5, 100],
    ],
    rect(25, 66, 65, 14),
  ],
  X.A,
);

const K = path(
  [
    rect(0, 0, T, 100),
    box(strokeQuad([12, 64], [W.K - 7, -3], 16.5), 0, W.K),
    box(strokeQuad([40, 42], [W.K - 3, 104], 17), 0, W.K),
  ],
  X.K,
);

// E: stem with a slightly concave outer edge, as drawn in the mockup.
const E = (() => {
  const x = X.E;
  return [
    `M${x} 0H${x + T}V100H${x}Q${x + 6} 50 ${x} 0Z`,
    `M${x} 0H${x + 81}V15H${x}Z`,
    `M${x} 43H${x + 73}V57H${x}Z`,
    `M${x} 85H${x + 81}V100H${x}Z`,
  ].join("");
})();

const D = (() => {
  const x = X.D;
  return `M${x} 0H${x + 54}A50 50 0 0 1 ${x + 54} 100H${x}Z M${x + T} 15H${x + 54}A35 35 0 0 1 ${x + 54} 85H${x + T}Z`;
})();

const O = (() => {
  const rx = W.O / 2;
  const cx = X.O + rx;
  const ix = rx - 17;
  return `M${cx - rx} 50A${rx} 51.2 0 1 0 ${cx + rx} 50A${rx} 51.2 0 1 0 ${cx - rx} 50Z M${cx - ix} 50A${ix} 36.2 0 1 0 ${cx + ix} 50A${ix} 36.2 0 1 0 ${cx - ix} 50Z`;
})();

export const LETTERS = [
  { id: "M", d: M, accent: false, rule: "nonzero" as const },
  { id: "A", d: A, accent: false, rule: "nonzero" as const },
  { id: "K", d: K, accent: false, rule: "nonzero" as const },
  { id: "E", d: E, accent: true, rule: "nonzero" as const },
  { id: "D", d: D, accent: false, rule: "evenodd" as const },
  { id: "O", d: O, accent: false, rule: "evenodd" as const },
];

type Props = {
  className?: string;
  /** Blueprint draw-in (outline first, then fill). */
  draw?: boolean;
  delay?: number;
};

export function Wordmark({ className, draw = false, delay = 0 }: Props) {
  // Same element tree on server and client; reduced motion only shortens the
  // timing (branching the markup would leave the SSR hidden state in place).
  const reduce = useReducedMotion();
  const k = reduce ? 0 : 1;

  return (
    <svg
      viewBox={`-2 -4 ${WORDMARK_WIDTH + 4} 108`}
      className={className}
      role="img"
      aria-label="MAKEDO"
      overflow="visible"
    >
      {LETTERS.map((l, i) => {
        const color = l.accent ? "var(--ember)" : "currentColor";
        if (!draw) return <path key={l.id} d={l.d} fill={color} fillRule={l.rule} />;
        const d0 = (delay + i * 0.09) * k;
        return (
          <motion.path
            key={l.id}
            d={l.d}
            fillRule={l.rule}
            fill={color}
            stroke={color}
            strokeWidth={1.6}
            initial={{ pathLength: 0, fillOpacity: 0, strokeOpacity: 1 }}
            animate={{ pathLength: 1, fillOpacity: 1, strokeOpacity: 0 }}
            transition={{
              pathLength: { duration: 1.1 * k, delay: d0, ease: [0.65, 0, 0.35, 1] },
              fillOpacity: { duration: 0.7 * k, delay: d0 + 0.85 * k, ease: "easeOut" },
              strokeOpacity: { duration: 0.5 * k, delay: d0 + 1.3 * k },
            }}
          />
        );
      })}
    </svg>
  );
}

/** "[ MAKEDO ]" header lock-up used on slides 2 and 3. */
export function BracketMark({ className }: { className?: string }) {
  const W = WORDMARK_WIDTH;
  return (
    <svg viewBox={`-74 -14 ${W + 148} 128`} className={className} role="img" aria-label="MAKEDO">
      <path d="M-72 -12H-38V2H-56V98H-38V112H-72Z" fill="currentColor" />
      <path d={`M${W + 72} -12H${W + 38}V2H${W + 56}V98H${W + 38}V112H${W + 72}Z`} fill="currentColor" />
      {LETTERS.map((l) => (
        <path key={l.id} d={l.d} fillRule={l.rule} fill={l.accent ? "var(--ember)" : "currentColor"} />
      ))}
    </svg>
  );
}
