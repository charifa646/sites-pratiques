import { forwardRef } from "react";

/**
 * Figma-style selection frame. Geometry (translate/size) and visibility are
 * written imperatively by the 3D scene every frame, so it tracks the object.
 */
export const SelectionBox = forwardRef<HTMLDivElement>(function SelectionBox(_, ref) {
  const handle =
    "sel-handle absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 border border-[#4f8f14] bg-lime shadow-[0_0_10px_rgba(126,211,33,0.55)] xl:h-[calc(var(--u)*13)] xl:w-[calc(var(--u)*13)] xl:min-h-[8px] xl:min-w-[8px]";
  return (
    <div
      ref={ref}
      aria-hidden
      data-state="off"
      className="selection pointer-events-none absolute left-0 top-0 h-0 w-0 will-change-transform"
    >
      <span className="sel-line sel-x absolute left-0 top-0 h-[1.5px] w-full origin-left bg-lime" />
      <span className="sel-line sel-x absolute bottom-0 left-0 h-[1.5px] w-full origin-right bg-lime" />
      <span className="sel-line sel-y absolute left-0 top-0 h-full w-[1.5px] origin-bottom bg-lime" />
      <span className="sel-line sel-y absolute right-0 top-0 h-full w-[1.5px] origin-top bg-lime" />
      <span className={handle} style={{ left: "0%", top: "0%" }} />
      <span className={handle} style={{ left: "50%", top: "0%" }} />
      <span className={handle} style={{ left: "100%", top: "0%" }} />
      <span className={handle} style={{ left: "0%", top: "50%" }} />
      <span className={handle} style={{ left: "100%", top: "50%" }} />
      <span className={handle} style={{ left: "0%", top: "100%" }} />
      <span className={handle} style={{ left: "50%", top: "100%" }} />
      <span className={handle} style={{ left: "100%", top: "100%" }} />
    </div>
  );
});
