import type { CSSProperties } from "react";

/**
 * Desktop "stage" coordinate system.
 * Every slide is laid out in mockup pixels (1926 × 1092 reference frame).
 * `--u` (declared on `.stage`) is one mockup pixel expressed in container
 * query units, so positions scale with the stage width. These variables are
 * only consumed at ≥1280px (see `.at` / `.fs` in globals.css); smaller screens
 * use the regular flow layout.
 */
export const STAGE_W = 1926;
export const STAGE_H = 1092;

export const u = (n: number) => `calc(var(--u) * ${n})`;

type Vars = CSSProperties & Record<`--${string}`, string>;

const len = (n: number | string) => (typeof n === "number" ? u(n) : n);

/**
 * Absolute box in mockup pixels (applied through the `.at` class).
 * Numbers are mockup pixels, strings are raw CSS lengths (e.g. "1px").
 */
export function at(x: number | string, y: number | string, w?: number | string, h?: number | string): Vars {
  const v: Vars = { "--x": len(x), "--y": len(y) };
  if (w !== undefined) v["--w"] = len(w);
  if (h !== undefined) v["--h"] = len(h);
  return v;
}

/** Font size in mockup pixels with a readable floor (applied through `.fs`). */
export function fs(px: number, lineHeight?: number, min = 12): Vars {
  const v: Vars = { "--fs": `max(${min}px, ${u(px)})` };
  if (lineHeight !== undefined) v["--lh"] = String(lineHeight);
  return v;
}

export const merge = (...styles: Vars[]): Vars => Object.assign({}, ...styles);
