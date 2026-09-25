"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { cta, work } from "@/lib/copy";
import { projects, type Project } from "@/lib/projects";
import { Rise } from "@/components/ui/motion";
import { BrowserMock, PhoneMock, SalesMock, WindowBar } from "@/components/v2/Mockups";
import { HEADER_H, Label, PrimaryButton, goTo } from "@/components/v2/ui";

/** Which drawing previews a project without a capture yet (as on the 3D site). */
const PREVIEW: Record<string, string> = { "Site vitrine": "vitrine", "Landing page": "landing", "Page de vente": "vente" };
const previewOf = (type: string) => PREVIEW[type] ?? "vitrine";

/** How much of each card stays in sight above the next one, in px. */
const PEEK = 16;

/**
 * One card of the pile, in a screen-tall slot that sticks at the top: the next
 * slot slides over it. Each card sits a little lower than the one before, so
 * the edges of the pile stay in sight; once covered, a card darkens and steps
 * back, the deeper the smaller.
 */
function Slot({ i, count, progress, children }: { i: number; count: number; progress: MotionValue<number>; children: ReactNode }) {
  const step = 1 / Math.max(1, count - 1);
  const scale = useTransform(progress, [i * step, 1], [1, 1 - (count - 1 - i) * 0.035]);
  const shade = useTransform(progress, [i * step, Math.min(1, (i + 1) * step)], [0, i === count - 1 ? 0 : 0.42]);
  const top = HEADER_H + 16 + i * PEEK;
  return (
    <div className="sticky top-0 h-[100svh]" style={{ paddingTop: top }}>
      <motion.article
        style={{ scale, transformOrigin: "50% 0%", height: `min(var(--pile-h), calc(100svh - ${HEADER_H + 16 + (count - 1) * PEEK + 36}px))` }}
        className="pile-card relative flex flex-col overflow-hidden rounded-[28px] border border-line bg-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_-28px_56px_-30px_rgba(0,0,0,0.95)]"
      >
        {children}
        <motion.span aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.article>
    </div>
  );
}

/** A project: its name and kind, then the site itself, large (its capture, or the drawing of its kind). */
function ProjectCard({ p, i }: { p: Project; i: number }) {
  const kind = previewOf(p.type);
  return (
    <>
      <div className="flex items-start justify-between gap-5 px-5 pb-4 pt-5 sm:px-8 sm:pb-5 sm:pt-7">
        <div className="min-w-0">
          <span className="font-display text-[14px] tabular-nums text-acid">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-1 font-display text-[clamp(1.6rem,3vw,2.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">{p.title}</h3>
          {p.summary && <p className="mt-2 max-w-[36rem] text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">{p.summary}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3 pt-1">
          <span className="rounded-full border border-line px-3 py-1 text-[13px] text-ink-soft">{p.type}</span>
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-medium underline decoration-ink/25 underline-offset-[6px] transition-colors hover:decoration-ink"
            >
              {work.visit} <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </div>
      <div className="pose-stage relative mx-3 mb-3 min-h-0 flex-1 overflow-hidden rounded-[20px] bg-white sm:mx-4 sm:mb-4">
        <div className="pose-shot">
          {p.image ? (
            <div className="shot-image overflow-hidden rounded-[10px] border border-line bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)] [container-type:inline-size]">
              <WindowBar />
              <div className="relative aspect-[16/10]">
                <Image src={p.image} alt={`${p.title}, ${p.type}`} fill sizes="(min-width: 1024px) 900px, 92vw" className="object-cover object-top" />
              </div>
            </div>
          ) : kind === "landing" ? (
            <PhoneMock className="shot-phone" />
          ) : kind === "vente" ? (
            <SalesMock className="shot-sales" />
          ) : (
            <BrowserMock className="shot-browser" />
          )}
        </div>
      </div>
    </>
  );
}

/** The last card of the pile: an empty frame, the place kept for the next project. */
function NextCard() {
  return (
    <div className="flex min-h-0 flex-1 p-3 sm:p-4">
      <div
        data-ghost="r"
        data-ghost-x="-0.85"
        data-ghost-y="0.12"
        data-ghost-m="none"
        className="relative flex flex-1 flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-line px-6 text-center"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[18px] bg-[radial-gradient(55%_50%_at_50%_55%,rgba(182,255,59,0.09),transparent_72%)]"
        />
        <h3 className="relative max-w-[16ch] font-display text-[clamp(2rem,4.4vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          {work.next.title}
        </h3>
        <p className="relative mt-4 max-w-[30rem] text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">{work.next.text}</p>
        <PrimaryButton className="relative mt-8" onClick={() => goTo("contact")}>
          {cta.quote}
        </PrimaryButton>
      </div>
    </div>
  );
}

/**
 * Réalisations on /pose: the projects are a pile of cards. Scrolling lays
 * each one over the one before; the last is the place for the next project.
 */
export function PoseWork({ n }: { n?: string }) {
  const stack = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stack, offset: ["start start", "end end"] });
  const count = projects.length + 1;

  return (
    <section id="realisations" aria-labelledby="pose-work-title" className="bg-white pb-24 pt-24 lg:pb-32 lg:pt-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Rise>
              <Label n={n}>{work.eyebrow}</Label>
            </Rise>
            <Rise delay={0.05}>
              <h2 id="pose-work-title" className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">
                {work.title.lead} <span className="font-serif font-normal italic tracking-[-0.01em]">{work.title.accent}</span>
              </h2>
            </Rise>
          </div>
          <Rise as="p" delay={0.1} className="max-w-[26rem] text-[17px] leading-relaxed text-ink-soft">
            {work.text}
          </Rise>
        </div>

        <div ref={stack} className="relative mt-2 lg:mt-4">
          {projects.map((p, i) => (
            <Slot key={p.title} i={i} count={count} progress={scrollYProgress}>
              <ProjectCard p={p} i={i} />
            </Slot>
          ))}
          <Slot i={projects.length} count={count} progress={scrollYProgress}>
            <NextCard />
          </Slot>
        </div>
      </div>
    </section>
  );
}
