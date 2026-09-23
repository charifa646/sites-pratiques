"use client";

import { cta, needForOffer, offer } from "@/lib/copy";
import { diveTo } from "@/lib/scroll";
import { useIntent } from "@/components/ui/Providers";
import { Button } from "@/components/ui/Button";
import { Mask, Rise, cx } from "@/components/ui/motion";

/**
 * Three pinned stations: each service card sits opposite its 3D mockup
 * (the mockups alternate sides as the camera dives past them).
 */
export function Offer() {
  const { setNeed } = useIntent();

  return (
    <section id="services" aria-labelledby="services-title" className="relative">
      {offer.items.map((item, i) => {
        const right = i % 2 === 1;
        return (
          <div key={item.id} id={item.anchor} data-station={`offer-${i + 1}`} className="relative h-[150vh]">
            <div className="sticky top-0 flex h-[100svh] items-end pb-[6svh] lg:items-center lg:pb-0">
              <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-10">
                <div className={cx("max-w-[560px]", right && "lg:ml-auto")}>
                  {i === 0 && (
                    <header className="mb-7">
                      <Rise className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-fog">
                        <span className="h-px w-8 bg-acid" />
                        {offer.eyebrow}
                      </Rise>
                      <h2
                        id="services-title"
                        className="mt-4 font-display text-[clamp(2.2rem,4.8vw,4.4rem)] font-semibold leading-[1] tracking-[-0.035em] text-bone"
                      >
                        <Mask className="pb-[0.06em]">
                          Ce que nous <span className="font-serif font-normal italic text-acid">créons.</span>
                        </Mask>
                      </h2>
                    </header>
                  )}
                  <Rise blur={false} className="glass relative overflow-hidden rounded-[28px] p-7 sm:p-9">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-6 -top-10 font-display text-[9rem] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(182,255,59,0.35)]"
                    >
                      {item.n}
                    </span>
                    <p className="font-display text-sm tabular-nums text-acid">{item.n}</p>
                    <h3 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-bone">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-[28rem] text-[16px] leading-relaxed text-fog sm:text-[17px]">{item.text}</p>
                    <Button
                      className="mt-7"
                      onClick={() => {
                        setNeed(needForOffer[item.id]);
                        diveTo("contact");
                      }}
                    >
                      {cta.quote}
                    </Button>
                  </Rise>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
