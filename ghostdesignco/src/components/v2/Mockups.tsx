import { cx } from "@/components/ui/motion";

/**
 * Pieces for pages drawn in HTML (used by the "site that builds itself"):
 * bars for text, soft gradients for photos, a window bar. Sizes are in cqw,
 * so a drawing scales as one piece inside its size container.
 */

export function Bar({ className }: { className: string }) {
  return <span className={cx("block rounded-full", className)} />;
}

export function Photo({ className, tone = "green" }: { className?: string; tone?: "green" | "warm" | "stone" }) {
  const tones = {
    green: "bg-[linear-gradient(135deg,#E9E6DC_0%,#D8E6C1_55%,#C2E383_100%)]",
    warm: "bg-[linear-gradient(135deg,#EFE9DF_0%,#E5D8C5_60%,#D4C3A9_100%)]",
    stone: "bg-[linear-gradient(160deg,#EEECE5_0%,#DCD9CF_100%)]",
  };
  return (
    <span className={cx("relative block overflow-hidden", tones[tone], className)}>
      <span className="absolute left-[28%] top-[24%] h-[56%] w-[46%] rounded-full bg-white/60 blur-[2cqw]" />
      <span className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/[0.07] to-transparent" />
    </span>
  );
}

export function WindowBar() {
  return (
    <div className="flex items-center gap-[0.9cqw] border-b border-line bg-[#FAF9F6] px-[2.2cqw] py-[1.5cqw]">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-[1.3cqw] w-[1.3cqw] rounded-full bg-[#E0DDD4]" />
      ))}
      <span className="mx-auto h-[2.5cqw] w-[36%] rounded-full bg-[#EFEDE6]" />
      <span className="w-[4.8cqw]" />
    </div>
  );
}

export function Arrowhead({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
