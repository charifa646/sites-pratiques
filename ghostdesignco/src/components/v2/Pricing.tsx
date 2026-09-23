"use client";

import { cta, pricing } from "@/lib/copy";
import { Rise } from "@/components/ui/motion";
import { Check, Eyebrow, PrimaryButton, goTo } from "./ui";

/** Tarifs: no price list, a tailored quote, and what is always true. */
export function V2Pricing() {
  return (
    <section id="tarifs" aria-labelledby="v2-pricing-title" className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Rise blur={false}>
          <div
            data-ghost="tl"
            data-ghost-x="0.55"
            data-ghost-y="-0.4"
            data-ghost-m="tr"
            data-ghost-mx="-0.45"
            data-ghost-my="-0.4"
            className="relative grid overflow-hidden rounded-[36px] border border-line bg-white lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="p-8 sm:p-12 lg:p-16">
              <Eyebrow>{pricing.eyebrow}</Eyebrow>
              <h2 id="v2-pricing-title" className="mt-6 font-display text-[clamp(2.3rem,5vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
                {pricing.title}
                <span className="mt-2 block font-serif text-[0.9em] font-normal italic tracking-[-0.01em]">
                  <span className="relative inline-block pr-[0.06em]">
                    <span aria-hidden className="absolute inset-x-[-0.04em] bottom-[0.1em] h-[0.26em] rounded-full bg-acid" />
                    <span className="relative">{pricing.sub}</span>
                  </span>
                </span>
              </h2>
              <p className="mt-6 max-w-[30rem] text-[17px] leading-relaxed text-ink-soft sm:text-[19px]">{pricing.text}</p>
            </div>
            <div className="flex flex-col justify-center gap-8 border-t border-line bg-[linear-gradient(160deg,#FBFAF6,#F1EFE8)] p-8 sm:p-12 lg:border-l lg:border-t-0 lg:p-16">
              <ul className="space-y-5">
                {pricing.perks.map((p) => (
                  <li key={p} className="flex items-center gap-4 text-[18px] font-medium">
                    <span className="scale-125">
                      <Check />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <PrimaryButton className="self-start" onClick={() => goTo("contact")}>
                {cta.quote}
              </PrimaryButton>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
