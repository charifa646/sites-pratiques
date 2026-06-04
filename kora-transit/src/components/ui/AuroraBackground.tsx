import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Ambient cinematic background: deep navy base, optional dark photo layer,
 * slow-moving gold "aurora" glows, a diagonal light sweep and a faint grid.
 * Decorative only — absolute-fills its (relative) parent.
 */
export function AuroraBackground({
  className,
  image,
  imageOpacity = 0.3,
  position = "center",
}: {
  className?: string;
  image?: string;
  imageOpacity?: number;
  position?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_0%,#0B1628_38%,#070F1C_100%)]" />

      {image && (
        <>
          <Image
            src={image}
            alt=""
            fill
            sizes="100vw"
            style={{ opacity: imageOpacity, objectPosition: position }}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/75 via-navy/60 to-navy/90" />
        </>
      )}

      <div className="absolute -top-1/3 left-1/4 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-gold/20 blur-[120px] animate-aurora" />
      <div className="absolute right-[-8rem] top-1/4 h-[48vh] w-[48vh] rounded-full bg-gold/10 blur-[130px] animate-pulse-glow" />
      <div className="absolute bottom-[-20%] left-[8%] h-[46vh] w-[46vh] rounded-full bg-[#163055]/50 blur-[120px] animate-float" />

      <div className="absolute inset-0 opacity-50 [background:linear-gradient(115deg,transparent_42%,rgba(201,168,76,0.07)_50%,transparent_58%)]" />

      <div className="mask-fade-b absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#1E2E45_1px,transparent_1px),linear-gradient(to_bottom,#1E2E45_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
  );
}
