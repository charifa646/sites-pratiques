"use client";

import { cta, pricing } from "@/lib/copy";
import { Rise } from "@/components/ui/motion";
import { Label, PrimaryButton, goTo } from "./ui";

/** Tarifs: no price list, a tailored quote, and what is always true. */
export function V2Pricing({ n }: { n?: string }) {
  return (
    <section id="tarifs" aria-labelledby="v2-pricing-title" className="border-t border-line bg-paper py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <Rise>
            <Label n={n}>{pricing.eyebrow}</Label>
          </Rise>
          <Rise delay={0.05}>
            <h2 id="v2-pricing-title" className="mt-5 font-display text-[clamp(2.4rem,5.2vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
              {pricing.title}
              <span className="mt-2 block font-serif text-[0.88em] font-normal italic tracking-[-0.01em] text-ink-soft">{pricing.sub}</span>
            </h2>
          </Rise>
          <Rise as="p" delay={0.1} className="mt-7 max-w-[32rem] text-[17px] leading-relaxed text-ink-soft sm:text-[19px]">
            {pricing.text}
          </Rise>
        </div>
        <Rise
          delay={0.12}
          blur={false}
          className="self-end"
        >
          <div data-ghost="tl" data-ghost-x="0.1" data-ghost-y="-0.4" data-ghost-clip="top" data-ghost-m="tr" data-ghost-mx="-0.4" data-ghost-my="0.1">
            <ul className="divide-y divide-line border-y border-line">
              {pricing.perks.map((p, i) => (
                <li key={p} className="flex items-baseline gap-5 py-5">
                  <span className="font-display text-[14px] tabular-nums text-ink-mute">0{i + 1}</span>
                  <span className="text-[19px] font-medium">{p}</span>
                </li>
              ))}
            </ul>
            <PrimaryButton className="mt-8" onClick={() => goTo("contact")}>
              {cta.quote}
            </PrimaryButton>
          </div>
        </Rise>
      </div>
    </section>
  );
}
