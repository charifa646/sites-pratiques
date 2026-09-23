import { forwardRef } from "react";
import { GhostMark } from "./Logo";

/**
 * Figma-style selection around the 3D ghost: frame name label, eight handles
 * and a live size pill. Geometry and visibility are written by the WebGL
 * world every frame (it projects the ghost's bounds to the screen).
 */
export const SelectionFrame = forwardRef<HTMLDivElement>(function SelectionFrame(_, ref) {
  const handle =
    "sel-handle absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] border-[1.5px] border-acid bg-void";
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      <div ref={ref} data-state="off" className="selection absolute left-0 top-0 h-0 w-0 will-change-transform">
        <span className="sel-line sel-x absolute left-0 top-0 h-px w-full origin-left bg-acid" />
        <span className="sel-line sel-x absolute bottom-0 left-0 h-px w-full origin-right bg-acid" />
        <span className="sel-line sel-y absolute left-0 top-0 h-full w-px origin-bottom bg-acid" />
        <span className="sel-line sel-y absolute right-0 top-0 h-full w-px origin-top bg-acid" />
        {[
          [0, 0],
          [50, 0],
          [100, 0],
          [0, 50],
          [100, 50],
          [0, 100],
          [50, 100],
          [100, 100],
        ].map(([l, t]) => (
          <span key={`${l}-${t}`} className={handle} style={{ left: `${l}%`, top: `${t}%` }} />
        ))}
        <span className="sel-tag absolute -top-7 left-0 inline-flex origin-bottom-left items-center gap-1.5 whitespace-nowrap rounded-[4px] bg-acid px-1.5 py-0.5 font-sans text-[11px] font-medium text-acid-ink">
          <GhostMark className="h-3 w-3" />
          Ghostdesignco
        </span>
        <span
          data-dims
          className="sel-tag absolute -bottom-7 left-1/2 origin-top -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-acid/90 px-1.5 py-0.5 font-sans text-[11px] font-medium tabular-nums text-acid-ink"
        >
          0 × 0
        </span>
      </div>
    </div>
  );
});
