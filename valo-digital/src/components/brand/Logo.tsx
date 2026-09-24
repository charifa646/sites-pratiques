/**
 * The VD monogram, redrawn from the 2026 cover: a V whose right arm is cut
 * from the D by a hairline. Replace with the official vector file when the
 * client provides it.
 */
const V = "M0 0L158.8 0L343.3 568.9L527.5 0L688.2 0L459.3 719.4L228.5 719.4Z";
const D =
  "M697.2 0H886.5C1044 0 1164.3 112.2 1164.3 348.3C1164 563.2 1048.1 719.4 858 719.4H553.6V451.2ZM708.8 151.5H875.6C936.7 151.5 984.4 228.2 984.4 346.7C984.1 466.8 925.7 566 824.4 566H708.8Z";

export function Monogram({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 1165 720" className={className} fill="currentColor" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d={V} />
      <path d={D} fillRule="evenodd" />
    </svg>
  );
}

/** The lockup as on the cover: the monogram over « ValoDigital ». */
export function LogoStacked({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1165 1010" className={className} fill="currentColor" role="img" aria-label="VALO DIGITAL">
      <path d={V} />
      <path d={D} fillRule="evenodd" />
      <text
        x="582"
        y="960"
        textAnchor="middle"
        textLength="1165"
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: 250 }}
      >
        ValoDigital
      </text>
    </svg>
  );
}

/** Monogram and name side by side, for the header. */
export function LogoInline({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Monogram className="h-[26px] w-auto sm:h-[30px]" />
      <span className="text-[17px] font-semibold tracking-[-0.01em] sm:text-[19px]">ValoDigital</span>
    </span>
  );
}
