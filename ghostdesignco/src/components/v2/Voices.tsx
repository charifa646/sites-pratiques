"use client";

import { voices } from "@/lib/copy";
import { testimonials } from "@/lib/testimonials";
import { VideoCard } from "@/components/sections/Voices";
import { Rise } from "@/components/ui/motion";
import { Spotlight } from "./Extras";

/** Client videos on a dark band (players load only on play). */
export function V2Voices() {
  return (
    <section id="temoignages" aria-labelledby="v2-voices-title" data-ghost-dark className="bg-white px-3 py-4 sm:px-6">
      <div className="relative overflow-hidden rounded-[36px] bg-[#0B0B0C] text-bone">
        <Spotlight />
        <div
          data-ghost="tr"
          data-ghost-x="-0.55"
          data-ghost-y="0.5"
          data-ghost-m="edge-t"
          data-ghost-my="0.55"
          className="relative mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <Rise className="flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-fog">
                <span className="h-1.5 w-1.5 rounded-full bg-acid" />
                {voices.eyebrow}
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
      </div>
    </section>
  );
}
