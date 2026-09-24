"use client";

import { cta, pricing } from "@/lib/copy";
import { diveTo } from "@/lib/scroll";
import { Button } from "@/components/ui/Button";
import { Mask, Rise } from "@/components/ui/motion";

/** Tarifs: no price list, a tailored quote, and what is always true. */
export function Pricing() {
  return (
    <section id="tarifs" data-station="pricing" aria-labelledby="pricing-title" className="relative h-[140vh]">
      <div className="sticky top-0 flex h-[100svh] items-end pb-[7svh] lg:items-center lg:pb-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_55%_at_20%_80%,rgb(var(--c-void)/0.85),transparent_75%)] lg:bg-[radial-gradient(50%_70%_at_22%_50%,rgb(var(--c-void)/0.78),transparent_72%)]"
        />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-10">
          <div className="max-w-[600px]">
            <Rise className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-fog">
              <span className="h-px w-8 bg-acid" />
              {pricing.eyebrow}
            </Rise>
            <h2
              id="pricing-title"
              className="mt-4 font-display text-[clamp(2.4rem,5.4vw,5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-bone"
            >
              <Mask className="pb-[0.05em]">{pricing.title}</Mask>
              <Mask delay={0.08} className="pb-[0.1em]" innerClassName="glow font-serif font-normal italic tracking-[-0.01em] text-acid">
                {pricing.sub}
              </Mask>
            </h2>
            <Rise as="p" delay={0.2} className="mt-5 max-w-[30rem] text-[16px] leading-relaxed text-fog sm:text-[18px]">
              {pricing.text}
            </Rise>
            <Rise delay={0.28} className="mt-6 flex flex-wrap gap-2.5">
              {pricing.perks.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-2 text-[13px] text-bone/90"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-acid" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {p}
                </span>
              ))}
            </Rise>
            <Rise delay={0.36} className="mt-8">
              <Button onClick={() => diveTo("contact")}>{cta.quote}</Button>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}
