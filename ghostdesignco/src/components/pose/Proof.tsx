"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { proof } from "@/lib/copy";
import { Arrow } from "@/components/ui/Button";
import { Counter, EXPO, Rise } from "@/components/ui/motion";
import { Label, goTo } from "@/components/v2/ui";

const icon = "h-[22px] w-[22px]";

/** Line icons for the four figures (drawn, never emoji). */
const ICONS: Record<string, ReactNode> = {
  projects: (
    <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3.5" y="4" width="17" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" strokeLinecap="round" />
    </svg>
  ),
  years: (
    <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  days: (
    <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M13 3 5.5 13.5H12l-1 7.5 7.5-10.5H12L13 3Z" strokeLinejoin="round" />
    </svg>
  ),
  custom: (
    <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" strokeLinejoin="round" />
      <path d="m14 7 3 3" strokeLinecap="round" />
    </svg>
  ),
};

/** The four figures: the two of the site, and two facts it states everywhere (the delay, made to measure). */
const FIGURES = [
  { key: "projects", count: proof.stats[0].value, value: null, suffix: proof.stats[0].suffix, label: proof.stats[0].label, tilt: -5, y: 0 },
  { key: "years", count: proof.stats[1].value, value: null, suffix: proof.stats[1].suffix, label: proof.stats[1].label, tilt: 4, y: -18 },
  { key: "days", count: null, value: "5 à 15", suffix: "", label: "jours pour être en ligne", tilt: 3, y: 10 },
  { key: "custom", count: 100, value: null, suffix: " %", label: "sur mesure", tilt: -4, y: -8 },
] as const;

/**
 * En chiffres, on the site: four glass cards laid a little askew, like prints
 * dropped on a table; they settle in when they come on screen and straighten
 * under the pointer.
 */
export function PoseProof({ n }: { n?: string }) {
  const reduce = useReducedMotion();
  return (
    <section id="preuve" aria-labelledby="pose-proof-title" className="overflow-hidden bg-paper pb-20 pt-20 sm:pb-24 lg:pb-28 lg:pt-28">
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div data-ghost="bl" data-ghost-x="0.6" data-ghost-y="1.05" data-ghost-m="none">
          <Rise>
            <Label n={n}>{proof.eyebrow}</Label>
          </Rise>
          <Rise delay={0.05}>
            <h2 id="pose-proof-title" className="mt-5 font-display text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[1] tracking-[-0.04em]">
              L&apos;essentiel,
              <span className="mt-1 block font-serif font-normal italic tracking-[-0.01em] text-ink-soft">en quatre chiffres.</span>
            </h2>
          </Rise>
          <Rise as="p" delay={0.1} className="mt-6 max-w-[27rem] text-[17px] leading-relaxed text-ink-soft">
            Des sites vitrines, des landing pages et des pages de vente, tous conçus sur mesure.
          </Rise>
          <Rise delay={0.15} className="mt-7">
            <button
              type="button"
              onClick={() => goTo("realisations")}
              className="group inline-flex items-center gap-2 text-[15px] font-medium text-ink transition-colors hover:text-acid"
            >
              Voir nos réalisations
              <Arrow className="h-4 w-4 transition-transform duration-300 ease-expo group-hover:translate-x-1" />
            </button>
          </Rise>
        </div>

        <ul className="mx-auto grid w-full max-w-[560px] grid-cols-2 gap-3 sm:gap-5 lg:mr-0">
          {FIGURES.map((f, i) => (
            <motion.li
              key={f.key}
              initial={reduce ? false : { opacity: 0, y: 60, rotate: 0 }}
              whileInView={{ opacity: 1, y: f.y, rotate: f.tilt }}
              whileHover={{ rotate: 0, y: f.y - 6, scale: 1.03 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1, delay: reduce ? 0 : 0.08 * i, ease: EXPO }}
              style={reduce ? { rotate: f.tilt, y: f.y } : undefined}
              className="relative flex aspect-[1/1.02] flex-col items-center justify-center rounded-[22px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.075),rgba(255,255,255,0.015)_55%)] px-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_60px_-28px_rgba(0,0,0,0.9)]"
            >
              <span className="text-ink-soft">{ICONS[f.key]}</span>
              <span className="mt-3 font-display text-[clamp(2.1rem,5.4vw,4rem)] font-semibold leading-none tracking-[-0.05em] sm:mt-4">
                {f.count !== null ? <Counter to={f.count} /> : f.value}
                <span className="text-[0.5em] font-medium tracking-[-0.02em] text-ink-soft">{f.suffix}</span>
              </span>
              <span className="mt-2 text-[12.5px] leading-snug text-ink-soft sm:mt-3 sm:text-[14px]">{f.label}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
