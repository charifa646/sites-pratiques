/**
 * The edge between two sections: the next section's colour rising as a wave,
 * lower on the left and higher on the right, like a curve that grows.
 * `crest` draws the brand's yellow line along it.
 */
const EDGE = "M0,70 C120,88 220,104 360,102 C560,98 700,60 900,42 C1060,28 1200,14 1320,18 C1380,20 1420,26 1440,30";

export function Wave({ fill, flip = false, crest = false }: { fill: string; flip?: boolean; crest?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 bottom-[-1px] z-[1] block h-[46px] w-full sm:h-[64px] lg:h-[96px] ${flip ? "-scale-x-100" : ""}`}
    >
      <path d={`${EDGE} L1440,120 L0,120 Z`} fill={fill} />
      {crest && <path d={EDGE} fill="none" stroke="#FDEC05" strokeWidth="4" vectorEffect="non-scaling-stroke" transform="translate(0,-5)" />}
    </svg>
  );
}
