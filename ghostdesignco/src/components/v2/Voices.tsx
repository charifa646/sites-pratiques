"use client";

import { voices } from "@/lib/copy";
import { testimonials } from "@/lib/testimonials";
import { VideoCard } from "@/components/sections/Voices";
import { Rise } from "@/components/ui/motion";
import { Label } from "./ui";

/** Client videos on a full-width dark band (players load only on play). */
export function V2Voices({ n }: { n?: string }) {
  return (
    <section id="temoignages" aria-labelledby="v2-voices-title" data-ghost-dark className="bg-[#0B0B0C] text-bone">
      <div
        data-ghost="tr"
        data-ghost-x="-0.55"
        data-ghost-y="0.5"
        data-ghost-m="edge-t"
        data-ghost-my="0.55"
        className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Rise>
              <Label n={n} dark>
                {voices.eyebrow}
              </Label>
            </Rise>
            <Rise delay={0.05}>
              <h2 id="v2-voices-title" className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">
                {voices.title.lead}{" "}
                <span className="whitespace-nowrap pr-[0.06em] font-serif font-normal italic tracking-[-0.01em] text-acid">{voices.title.accent}</span>
              </h2>
            </Rise>
          </div>
          <Rise as="p" delay={0.1} className="max-w-[24rem] text-[17px] leading-relaxed text-fog">
            {voices.text}
          </Rise>
        </div>

        <Rise delay={0.15} blur={false} className="-mx-5 mt-12 sm:-mx-8">
          <div className="flex snap-x snap-mandatory items-end gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:gap-5 sm:px-8 [&::-webkit-scrollbar]:hidden">
            {testimonials.map((t, i) => (
              <VideoCard key={i} t={t} />
            ))}
          </div>
        </Rise>
      </div>
    </section>
  );
}
