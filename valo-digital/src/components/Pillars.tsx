import { brand } from "@/lib/catalogue";
import { Flag } from "@/components/brand/Motifs";

/**
 * Two bands crossing: the catalogue's four pillars on the cover's yellow,
 * and its promise running the other way on the blue.
 */
export function Pillars() {
  const pillars = [...brand.pillars, ...brand.pillars];
  const promise = brand.promise.map((p) => `${p.lead} ${p.key}`);
  return (
    <section aria-label={brand.pillars.join(", ")} className="relative h-[150px] overflow-hidden bg-white sm:h-[180px] lg:h-[220px]">
      <div aria-hidden className="absolute left-[-5%] top-1/2 w-[110%] -translate-y-1/2 rotate-[3deg] bg-electric py-3 lg:py-4">
        <div className="marquee-rev flex w-max">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {[...promise, ...promise].map((t, i) => (
                <span key={i} className="outline-text flex items-center gap-6 whitespace-nowrap pr-6 text-[22px] font-extrabold uppercase tracking-[-0.01em] sm:text-[28px] lg:text-[34px]">
                  {t}
                  <span className="text-sun [-webkit-text-stroke:0]">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-[-5%] top-1/2 w-[110%] -translate-y-1/2 -rotate-[2.5deg] bg-sun py-3 shadow-[0_18px_40px_-20px_rgba(4,11,82,0.45)] lg:py-4">
        <div className="marquee flex w-max" aria-hidden>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {[...pillars, ...pillars].map((t, i) => (
                <span key={i} className="flex items-center gap-6 whitespace-nowrap pr-6 text-[26px] font-extrabold uppercase tracking-[-0.01em] text-navy sm:text-[34px] lg:text-[44px]">
                  {t}
                  <Flag className="h-[0.42em] w-auto" />
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="sr-only">{brand.pillars.join(" - ")}</p>
      </div>
    </section>
  );
}
