"use client";

import { proof } from "@/lib/copy";
import { Counter, Rise } from "@/components/ui/motion";

export function Proof() {
  return (
    <section id="preuve" data-station="proof" aria-label={proof.eyebrow} className="relative h-[150vh]">
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-10">
          <Rise className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-fog">
            <span className="h-px w-8 bg-acid" />
            {proof.eyebrow}
          </Rise>
          <div className="mt-8 grid gap-12 sm:mt-10 sm:grid-cols-2 sm:gap-8 lg:max-w-[1100px]">
            {proof.stats.map((s, i) => (
              <Rise key={s.label} delay={0.12 * i}>
                <div className="font-display text-[clamp(5.5rem,17vw,15rem)] font-semibold leading-[0.82] tracking-[-0.06em] text-bone">
                  <Counter to={s.value} />
                  <span className="glow font-serif text-[0.62em] font-normal italic tracking-[-0.02em] text-acid">
                    {s.suffix}
                  </span>
                </div>
                <p className="mt-4 border-t border-white/10 pt-4 text-[17px] text-fog sm:text-lg">{s.label}</p>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
