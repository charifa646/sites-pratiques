import { cn } from "@/lib/utils";

/**
 * Ambient premium background: deep navy base + slow-moving gold "aurora" glows
 * and a faint grid. Decorative only — absolute-fills its (relative) parent.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_0%,#0B1628_38%,#070F1C_100%)]" />

      <div className="absolute -top-1/3 left-1/4 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-gold/20 blur-[120px] animate-aurora" />
      <div className="absolute right-[-8rem] top-1/4 h-[48vh] w-[48vh] rounded-full bg-gold/10 blur-[130px] animate-pulse-glow" />
      <div className="absolute bottom-[-20%] left-[8%] h-[46vh] w-[46vh] rounded-full bg-[#163055]/50 blur-[120px] animate-float" />

      <div className="mask-fade-b absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#1E2E45_1px,transparent_1px),linear-gradient(to_bottom,#1E2E45_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
  );
}
