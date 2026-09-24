"use client";

import Image from "next/image";
import { cta, work } from "@/lib/copy";
import { projects } from "@/lib/projects";
import { Rise, cx } from "@/components/ui/motion";
import { WindowBar } from "./Mockups";
import { OfferVisual } from "./Services";
import { Label, PrimaryButton, goTo } from "./ui";

/** Which drawing previews a project without a capture yet (as on the 3D site). */
const PREVIEW: Record<string, string> = { "Site vitrine": "vitrine", "Landing page": "landing", "Page de vente": "vente" };
const previewOf = (type: string) => PREVIEW[type] ?? "vitrine";

/**
 * Réalisations: the projects of lib/projects, in order. A project with a
 * capture in /public/projects shows it; the others are previewed by the
 * drawing of their kind of page, like the 3D site's gallery. Then the
 * invitation to be the next one.
 */
export function V2Work({ n }: { n?: string }) {
  return (
    <section id="realisations" aria-labelledby="v2-work-title" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Rise>
              <Label n={n}>{work.eyebrow}</Label>
            </Rise>
            <Rise delay={0.05}>
              <h2 id="v2-work-title" className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">
                {work.title.lead} <span className="font-serif font-normal italic tracking-[-0.01em]">{work.title.accent}</span>
              </h2>
            </Rise>
          </div>
          <Rise as="p" delay={0.1} className="max-w-[26rem] text-[17px] leading-relaxed text-ink-soft">
            {work.text}
          </Rise>
        </div>

        <ol className="mt-14 grid gap-x-8 gap-y-14 lg:grid-cols-2">
          {projects.map((p, i) => (
            <Rise as="li" key={p.title} delay={(i % 2) * 0.08} blur={false} className={cx(i % 2 === 1 && "lg:mt-20")}>
              <figure>
                {p.image ? (
                  <div className="overflow-hidden rounded-[12px] border border-line bg-white shadow-[0_24px_60px_-34px_rgba(12,12,13,0.4)] [container-type:inline-size]">
                    <WindowBar />
                    <div className="relative aspect-[16/10]">
                      <Image src={p.image} alt={`${p.title}, ${p.type}`} fill sizes="(min-width: 1024px) 580px, 92vw" className="object-cover object-top" />
                    </div>
                  </div>
                ) : (
                  <div className="grid aspect-[16/11] place-items-center overflow-hidden rounded-[24px] border border-line bg-paper px-[6%] pt-[5%]">
                    <div className="h-full w-full">
                      <OfferVisual id={previewOf(p.type)} />
                    </div>
                  </div>
                )}
                <figcaption className="mt-5 flex items-baseline justify-between gap-6 border-b border-line pb-4">
                  <span>
                    <span className="block font-display text-[22px] font-semibold tracking-[-0.02em]">{p.title}</span>
                    {p.summary && <span className="mt-1 block text-[15px] text-ink-soft">{p.summary}</span>}
                  </span>
                  <span className="shrink-0 text-[14px] text-ink-mute">{p.type}</span>
                </figcaption>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[14px] font-medium underline decoration-ink/25 underline-offset-[6px] hover:decoration-ink">
                    {work.visit} <span aria-hidden>↗</span>
                  </a>
                )}
              </figure>
            </Rise>
          ))}
        </ol>

        <Rise blur={false} className="mt-16">
          <div
            data-ghost="tr"
            data-ghost-x="-0.5"
            data-ghost-y="-0.42"
            className="flex flex-col gap-8 border-t border-ink pt-10 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <h3 className="font-display text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">{work.next.title}</h3>
              <p className="mt-3 max-w-[32rem] text-[17px] leading-relaxed text-ink-soft">{work.next.text}</p>
            </div>
            <PrimaryButton className="self-start lg:self-auto" onClick={() => goTo("contact")}>
              {cta.quote}
            </PrimaryButton>
          </div>
        </Rise>
      </div>
    </section>
  );
}
