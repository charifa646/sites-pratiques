import { cx } from "@/components/ui/motion";

/**
 * Website mockups drawn in HTML: abstract but believable layouts (bars for
 * text, soft gradients for photos), like the painted screens of the 3D site.
 * Each mockup is a size container: everything inside is in cqw, so it scales
 * as one piece at any width.
 */

const frame =
  "overflow-hidden border border-line bg-white shadow-[0_1px_2px_rgba(12,12,13,0.05),0_30px_70px_-30px_rgba(12,12,13,0.32)]";

function Bar({ className }: { className: string }) {
  return <span className={cx("block rounded-full", className)} />;
}

function Photo({ className, tone = "green" }: { className?: string; tone?: "green" | "warm" | "stone" }) {
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

function WindowBar() {
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

function Arrowhead({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Showcase site in a browser window. */
export function BrowserMock({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cx("[container-type:inline-size]", className)}>
      <div className={cx(frame, "rounded-[2.2cqw]")}>
        <WindowBar />
        <div className="px-[4.5cqw] pb-[4.5cqw] pt-[3cqw]">
          <div className="flex items-center justify-between">
            <Bar className="h-[1.5cqw] w-[9cqw] bg-ink/80" />
            <span className="flex gap-[2.4cqw]">
              {[0, 1, 2, 3].map((i) => (
                <Bar key={i} className="h-[0.9cqw] w-[5.5cqw] bg-ink/15" />
              ))}
            </span>
            <Bar className="h-[3.4cqw] w-[11cqw] bg-acid" />
          </div>
          <div className="mt-[4.5cqw] grid grid-cols-[1.05fr_1fr] items-center gap-[4cqw]">
            <div>
              <Bar className="h-[2.6cqw] w-[92%] bg-ink/80" />
              <Bar className="mt-[1.4cqw] h-[2.6cqw] w-[68%] bg-ink/80" />
              <Bar className="mt-[2.8cqw] h-[1cqw] w-[88%] bg-ink/15" />
              <Bar className="mt-[1.1cqw] h-[1cqw] w-[76%] bg-ink/15" />
              <Bar className="mt-[1.1cqw] h-[1cqw] w-[50%] bg-ink/15" />
              <span className="mt-[3.2cqw] flex gap-[1.6cqw]">
                <Bar className="h-[4.2cqw] w-[15cqw] bg-acid" />
                <Bar className="h-[4.2cqw] w-[12cqw] border border-ink/15" />
              </span>
            </div>
            <Photo className="aspect-[4/3.3] rounded-[1.8cqw]" />
          </div>
          <div className="mt-[5cqw] grid grid-cols-3 gap-[2.2cqw]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-[1.6cqw] border border-line p-[2.2cqw]">
                <span className="block h-[4cqw] w-[4cqw] rounded-[1.1cqw] bg-[#ECEAE3]" />
                <Bar className="mt-[2.2cqw] h-[1.2cqw] w-[70%] bg-ink/70" />
                <Bar className="mt-[1.2cqw] h-[0.9cqw] w-[92%] bg-ink/10" />
                <Bar className="mt-[0.9cqw] h-[0.9cqw] w-[64%] bg-ink/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Landing page on a phone; it slowly scrolls down to its single action. */
export function PhoneMock({ className, scroll = true }: { className?: string; scroll?: boolean }) {
  return (
    <div aria-hidden className={cx("[container-type:inline-size]", className)}>
      <div className="rounded-[15cqw] bg-ink p-[3cqw] shadow-[0_30px_60px_-24px_rgba(12,12,13,0.5)]">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[12cqw] bg-white">
          <span className="absolute left-1/2 top-[2.6cqw] z-10 h-[5.5cqw] w-[28cqw] -translate-x-1/2 rounded-full bg-ink" />
          <div
            className={cx("absolute inset-x-0 top-0 px-[7cqw] pb-[12cqw] pt-[15cqw]", scroll && "v2-scroll")}
            // content height minus the screen (94cqw wide, 9:19)
            style={{ ["--v2-scroll" as string]: "calc(-100% + 198.4cqw)" }}
          >
            <div className="flex items-center justify-between">
              <Bar className="h-[3cqw] w-[20cqw] bg-ink/80" />
              <Bar className="h-[6.5cqw] w-[22cqw] bg-acid" />
            </div>
            <Bar className="mt-[11cqw] h-[5.5cqw] w-[96%] bg-ink/80" />
            <Bar className="mt-[3cqw] h-[5.5cqw] w-[84%] bg-ink/80" />
            <Bar className="mt-[3cqw] h-[5.5cqw] w-[58%] bg-ink/80" />
            <Bar className="mt-[6cqw] h-[2.3cqw] w-[92%] bg-ink/15" />
            <Bar className="mt-[2.4cqw] h-[2.3cqw] w-[74%] bg-ink/15" />
            <span className="mt-[7cqw] flex h-[13cqw] items-center justify-center gap-[3cqw] rounded-full bg-acid">
              <Bar className="h-[2.6cqw] w-[30cqw] bg-acid-ink/80" />
            </span>
            <Photo className="mt-[8cqw] h-[64cqw] rounded-[6cqw]" tone="warm" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="mt-[7cqw] flex items-center gap-[4cqw]">
                <span className="h-[11cqw] w-[11cqw] shrink-0 rounded-[3.5cqw] bg-[#ECEAE3]" />
                <span className="flex-1">
                  <Bar className="h-[2.6cqw] w-[70%] bg-ink/70" />
                  <Bar className="mt-[2.2cqw] h-[2cqw] w-[92%] bg-ink/10" />
                </span>
              </div>
            ))}
            <div className="mt-[9cqw] rounded-[6cqw] bg-paper p-[6cqw]">
              <span className="flex items-center gap-[3.5cqw]">
                <span className="h-[10cqw] w-[10cqw] rounded-full bg-[linear-gradient(135deg,#E5D8C5,#C9B79B)]" />
                <Bar className="h-[2.6cqw] w-[34cqw] bg-ink/60" />
              </span>
              <Bar className="mt-[4.5cqw] h-[2cqw] w-[96%] bg-ink/15" />
              <Bar className="mt-[2.2cqw] h-[2cqw] w-[80%] bg-ink/15" />
            </div>
            <span className="mt-[9cqw] flex h-[13cqw] items-center justify-center gap-[3cqw] rounded-full bg-acid text-acid-ink">
              <Bar className="h-[2.6cqw] w-[30cqw] bg-acid-ink/80" />
              <Arrowhead className="h-[5cqw] w-[5cqw]" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Price block card, as found on a sales page. */
export function PriceCard({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cx("[container-type:inline-size]", className)}>
      <div className={cx(frame, "rounded-[7cqw] p-[8cqw]")}>
        <Bar className="h-[3.2cqw] w-[34cqw] bg-ink/20" />
        <span className="mt-[5cqw] block h-[11cqw] w-[62cqw] rounded-[3cqw] bg-ink/85" />
        {[0, 1, 2].map((i) => (
          <span key={i} className="mt-[4.5cqw] flex items-center gap-[4cqw]">
            <span className="grid h-[7cqw] w-[7cqw] shrink-0 place-items-center rounded-full bg-acid">
              <svg viewBox="0 0 16 16" className="h-[4cqw] w-[4cqw] text-acid-ink" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <Bar className={cx("h-[3cqw] bg-ink/15", i === 1 ? "w-[42cqw]" : "w-[54cqw]")} />
          </span>
        ))}
        <span className="mt-[8cqw] flex h-[15cqw] items-center justify-center gap-[4cqw] rounded-full bg-acid text-acid-ink">
          <Bar className="h-[3.2cqw] w-[36cqw] bg-acid-ink/80" />
          <Arrowhead className="h-[6cqw] w-[6cqw]" />
        </span>
      </div>
    </div>
  );
}

/** Sales page: promise, product, proof, then the price block that closes. */
export function SalesMock({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cx("[container-type:inline-size]", className)}>
      <div className={cx(frame, "rounded-[2.4cqw]")}>
        <WindowBar />
        <div className="px-[5.5cqw] pb-[5.5cqw] pt-[3.5cqw]">
          <div className="flex items-center justify-between">
            <Bar className="h-[1.6cqw] w-[10cqw] bg-ink/80" />
            <Bar className="h-[1cqw] w-[14cqw] bg-ink/15" />
          </div>
          <div className="mt-[5cqw] flex flex-col items-center">
            <Bar className="h-[3cqw] w-[72%] bg-ink/80" />
            <Bar className="mt-[1.6cqw] h-[3cqw] w-[50%] bg-ink/80" />
            <Bar className="mt-[3cqw] h-[1.1cqw] w-[46%] bg-ink/15" />
          </div>
          <div className="mt-[5cqw] grid grid-cols-2 items-center gap-[4.5cqw]">
            <Photo className="aspect-[1/0.82] rounded-[2cqw]" tone="stone" />
            <div>
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="mt-[2.2cqw] flex items-center gap-[2.2cqw] first:mt-0">
                  <span className="h-[2.6cqw] w-[2.6cqw] shrink-0 rounded-full bg-acid" />
                  <Bar className={cx("h-[1.3cqw] bg-ink/20", i % 2 ? "w-[62%]" : "w-[80%]")} />
                </span>
              ))}
            </div>
          </div>
          <div className="mt-[5cqw] flex items-center justify-between gap-[4cqw] rounded-[2.2cqw] border-2 border-acid bg-acid/[0.08] p-[3.4cqw]">
            <span>
              <Bar className="h-[1.2cqw] w-[13cqw] bg-ink/25" />
              <span className="mt-[1.8cqw] block h-[4.6cqw] w-[22cqw] rounded-[1.2cqw] bg-ink/85" />
            </span>
            <span className="flex h-[6cqw] items-center gap-[1.6cqw] rounded-full bg-acid px-[3cqw] text-acid-ink">
              <Bar className="h-[1.3cqw] w-[13cqw] bg-acid-ink/80" />
              <Arrowhead className="h-[2.6cqw] w-[2.6cqw]" />
            </span>
          </div>
          <div className="mt-[4.5cqw] grid grid-cols-3 gap-[2.4cqw]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-[1.6cqw] border border-line p-[2.2cqw]">
                <span className="flex items-center gap-[1.6cqw]">
                  <span className="h-[3.6cqw] w-[3.6cqw] rounded-full bg-[linear-gradient(135deg,#E5D8C5,#C9B79B)]" />
                  <Bar className="h-[1.1cqw] w-[45%] bg-ink/50" />
                </span>
                <Bar className="mt-[2cqw] h-[0.9cqw] w-[94%] bg-ink/10" />
                <Bar className="mt-[0.9cqw] h-[0.9cqw] w-[70%] bg-ink/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
