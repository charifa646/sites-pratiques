/**
 * The graphic language of the 2026 cover: the flag (a yellow arrow entering a
 * notched blue band), the chains of outlined rounded squares and the five
 * icons in dotted circles.
 */

export function Flag({ className, arrow = false }: { className?: string; arrow?: boolean }) {
  if (arrow)
    return (
      <svg viewBox="0 0 54 20" className={className} aria-hidden>
        <path d="M0 0L53.2 10L0 20Z" fill="#FDEC05" />
      </svg>
    );
  return (
    <svg viewBox="0 0 91 20" className={className} aria-hidden>
      <path d="M0 0L53.2 10L0 20Z" fill="#FDEC05" />
      <path d="M17 0H91V20H17L66.8 10Z" fill="#0714D8" />
    </svg>
  );
}

const CHAINS = {
  // as on the right edge of the cover, going down in a zigzag
  right: [
    [127, 0],
    [64, 50],
    [0, 102],
    [55, 162],
    [119, 237],
  ],
  // as on its left edge
  left: [
    [63, 0],
    [0, 50],
    [3, 160],
    [59, 237],
  ],
} as const;

export function Squares({ chain = "right", className }: { chain?: keyof typeof CHAINS; className?: string }) {
  return (
    <svg viewBox="-2 -2 230 340" className={`squares ${className ?? ""}`} fill="none" aria-hidden>
      {CHAINS[chain].map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="98"
          height="98"
          rx="13"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
          style={{ ["--i" as string]: i }}
        />
      ))}
    </svg>
  );
}

const ICONS = [
  // phone
  <g key="phone">
    <rect x="18.5" y="13" width="11" height="22" rx="2.2" />
    <path d="M22.5 31h3" />
  </g>,
  // gears
  <g key="gears" strokeWidth="1.3">
    <path d="M24.95 19.82L26.81 19.95L26.81 22.05L24.95 22.18L24.48 23.31L25.71 24.72L24.22 26.21L22.81 24.98L21.68 25.45L21.55 27.31L19.45 27.31L19.32 25.45L18.19 24.98L16.78 26.21L15.29 24.72L16.52 23.31L16.05 22.18L14.19 22.05L14.19 19.95L16.05 19.82L16.52 18.69L15.29 17.28L16.78 15.79L18.19 17.02L19.32 16.55L19.45 14.69L21.55 14.69L21.68 16.55L22.81 17.02L24.22 15.79L25.71 17.28L24.48 18.69Z" />
    <circle cx="20.5" cy="21" r="1.9" />
    <path d="M32.42 28.78L33.7 28.88L33.7 30.72L32.42 30.82L31.89 31.74L32.44 32.89L30.86 33.81L30.13 32.75L29.07 32.75L28.34 33.81L26.76 32.89L27.31 31.74L26.78 30.82L25.5 30.72L25.5 28.88L26.78 28.78L27.31 27.86L26.76 26.71L28.34 25.79L29.07 26.85L30.13 26.85L30.86 25.79L32.44 26.71L31.89 27.86Z" />
    <circle cx="29.6" cy="29.8" r="1.2" />
  </g>,
  // magnifier
  <g key="search">
    <circle cx="27" cy="21" r="6.2" />
    <path d="M22.6 25.4l-8.1 8.1" />
  </g>,
  // chart
  <g key="chart">
    <path d="M13.5 33.5h21" />
    <path d="M15 33.5l3.2-8.5 3.2 8.5M19.8 33.5l4.2-15 4.2 15M26.5 33.5l3.3-10 3.3 10" />
  </g>,
  // network
  <g key="network">
    <circle cx="19" cy="17" r="3.2" />
    <circle cx="29" cy="17" r="3.2" />
    <circle cx="24" cy="30.5" r="3.2" />
    <path d="M22.2 17h3.6M20.6 19.9l2 7.6M27.4 19.9l-2 7.6" />
  </g>,
];

export function CoverIcons({ className }: { className?: string }) {
  return (
    <ul className={`cover-icons flex items-center gap-3 sm:gap-4 ${className ?? ""}`} aria-hidden>
      {ICONS.map((icon, i) => (
        <li key={i} style={{ ["--i" as string]: i }}>
          <svg viewBox="0 0 48 48" className="h-11 w-11 sm:h-12 sm:w-12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle className="cover-icon-ring" cx="24" cy="24" r="22" strokeDasharray="1.2 3.2" strokeWidth="1.1" />
            {icon}
          </svg>
        </li>
      ))}
    </ul>
  );
}

/** The catalogue's section header: yellow capitals on the electric blue band. */
export function Band({ children, className, as: Tag = "p", id }: { children: React.ReactNode; className?: string; as?: "p" | "h2"; id?: string }) {
  return (
    <Tag id={id} data-reveal="band" className={`band ${className ?? ""}`}>
      <span className="band-text">{children}</span>
    </Tag>
  );
}
