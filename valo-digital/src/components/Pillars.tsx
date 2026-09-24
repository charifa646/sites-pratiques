import { pillars } from "@/lib/content";

/** The catalogue's four words, running by on the cover's yellow. */
export function Pillars() {
  const run = [...pillars, ...pillars, ...pillars];
  return (
    <div className="overflow-hidden bg-sun py-4 text-navy lg:py-5" aria-label={pillars.join(", ")} role="img">
      <div className="marquee flex w-max" aria-hidden>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {run.map((t, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap pr-8 text-[24px] font-extrabold tracking-[-0.02em] sm:text-[30px] lg:text-[38px]">
                {t}
                <span className="h-2.5 w-2.5 bg-electric lg:h-3 lg:w-3" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
