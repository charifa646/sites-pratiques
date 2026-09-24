"use client";

import { proof } from "@/lib/copy";
import { Counter, Rise } from "@/components/ui/motion";
import { Label } from "./ui";

/** En chiffres: the two figures of the 3D site, counting up in big type. */
export function V2Proof({ n }: { n?: string }) {
  return (
    <section id="preuve" aria-label={proof.eyebrow} className="bg-paper pb-10 pt-20 sm:pb-16 lg:pb-14 lg:pt-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Rise>
          <Label n={n}>{proof.eyebrow}</Label>
        </Rise>
        <div data-ghost="tr" data-ghost-x="-0.7" data-ghost-y="0.55" data-ghost-m="tr" data-ghost-mx="-0.55" data-ghost-my="0.45" className="mt-8 grid gap-10 sm:mt-10 sm:grid-cols-2 sm:gap-8">
          {proof.stats.map((s, i) => (
            <Rise key={s.label} delay={0.1 * i}>
              <div className="font-display text-[clamp(5rem,13vw,11rem)] font-semibold leading-[0.84] tracking-[-0.06em]">
                <Counter to={s.value} />
                <span className="font-serif text-[0.62em] font-normal italic tracking-[-0.02em] text-acid-deep">{s.suffix}</span>
              </div>
              <p className="mt-4 border-t border-line pt-4 text-[17px] text-ink-soft sm:text-lg">{s.label}</p>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
