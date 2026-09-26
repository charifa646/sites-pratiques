import { cx } from "@/components/ui/motion";

/** One long wave: lower on the left, higher on the right, like a curve that grows. */
const EDGE = "M0,70 C120,88 220,104 360,102 C560,98 700,60 900,42 C1060,28 1200,14 1320,18 C1380,20 1420,26 1440,30";

/**
 * The edge between two sections on the site: the next section's colour rising
 * as a wave over the bottom of the one before (its padding). With `from`, the
 * wave takes its own band of that colour instead, for a section whose bottom
 * is not free. `crest` draws a thin acid line along it, `line` a faint one,
 * `flip` mirrors it.
 */
export function Wave({
  fill,
  from,
  flip = false,
  crest = false,
  line = false,
  className,
}: {
  fill: string;
  from?: string;
  flip?: boolean;
  crest?: boolean;
  line?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cx("pointer-events-none relative z-[2]", from ? "h-[40px] sm:h-[60px] lg:h-[88px]" : "h-0", className)}
      style={from ? { background: from } : undefined}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={cx("absolute inset-x-0 bottom-[-1px] block h-[40px] w-full sm:h-[60px] lg:h-[88px]", flip && "-scale-x-100")}
      >
        <path d={`${EDGE} L1440,120 L0,120 Z`} style={{ fill }} />
        {line && <path d={EDGE} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
        {crest && (
          <path
            d={EDGE}
            fill="none"
            stroke="#B6FF3B"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            className="drop-shadow-[0_0_6px_rgba(182,255,59,0.75)]"
          />
        )}
      </svg>
    </div>
  );
}
