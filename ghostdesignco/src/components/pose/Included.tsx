"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { method } from "@/lib/copy";
import { Arrow } from "@/components/ui/Button";
import { Rise, cx } from "@/components/ui/motion";
import { Label, goTo } from "@/components/v2/ui";

/**
 * Walks through `count` steps, one every `ms`, while on screen; the last one
 * lasts `hold` times longer, then it starts again. Still (on the last step)
 * when motion is reduced.
 */
function useSteps(count: number, ms: number, hold = 3) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduce) {
      setStep(count - 1);
      return;
    }
    if (!inView) return;
    let s = 0;
    let t = 0;
    setStep(0);
    const next = () => {
      t = window.setTimeout(
        () => {
          s = (s + 1) % count;
          setStep(s);
          next();
        },
        s === count - 1 ? ms * hold : ms,
      );
    };
    next();
    return () => window.clearTimeout(t);
  }, [inView, reduce, count, ms, hold]);
  return { ref, step };
}

const glass =
  "border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_50px_-24px_rgba(0,0,0,0.9)]";

/** 1. The texts: a page that writes itself, then gets its « Validé ». */
function Writing() {
  const { ref, step } = useSteps(7, 620, 4);
  const lines = [
    { w: "80%", bar: "h-[9px] bg-ink/85" },
    { w: "58%", bar: "h-[9px] bg-ink/85" },
    { w: "94%", bar: "h-[5px] bg-ink/25" },
    { w: "86%", bar: "h-[5px] bg-ink/25" },
    { w: "64%", bar: "h-[5px] bg-ink/25" },
  ];
  const writing = Math.min(step - 1, lines.length - 1);
  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center">
      <div
        className={cx(
          "relative w-[62%] max-w-[290px] -rotate-[4deg] rounded-[14px] p-5 transition-transform duration-700 ease-expo group-hover:rotate-0",
          glass,
        )}
      >
        <div className="mb-5 flex gap-1.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-1.5 w-1.5 rounded-full bg-white/20" />
          ))}
        </div>
        {lines.map((l, i) => (
          <div key={i} className={cx("relative", i === 0 ? "" : i === 2 ? "mt-5" : "mt-2.5")} style={{ width: l.w }}>
            <span
              className={cx("block origin-left rounded-full transition-transform duration-[560ms] ease-out", l.bar)}
              style={{ transform: `scaleX(${step > i ? 1 : 0})` }}
            />
            <span
              aria-hidden
              className={cx(
                "absolute -top-[3px] -ml-px h-[calc(100%+6px)] w-[2px] transition-[left] duration-[560ms] ease-out",
                writing === i && step < 6 ? "opacity-100" : "opacity-0",
              )}
              style={{ left: step > i ? "100%" : "0%" }}
            >
              <span className="pose-caret block h-full w-full rounded-full bg-acid" />
            </span>
          </div>
        ))}
        <span
          className={cx(
            "absolute -bottom-3 -right-3 inline-flex items-center gap-1.5 rounded-full bg-acid px-3 py-1.5 text-[12px] font-semibold text-acid-ink shadow-[0_10px_24px_-10px_rgba(182,255,59,0.7)] transition-[opacity,transform] duration-500 ease-expo",
            step >= 6 ? "scale-100 opacity-100" : "scale-75 opacity-0",
          )}
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
            <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Validé
        </span>
      </div>
    </div>
  );
}

/** 2. The delay: the three steps of the method, the line running from one to the next. */
function Timeline() {
  const { ref, step } = useSteps(3, 1100, 2.4);
  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center">
      <div
        className={cx(
          "relative w-[78%] max-w-[380px] -rotate-[3deg] rounded-[16px] px-5 pb-6 pt-4 transition-transform duration-700 ease-expo group-hover:rotate-0",
          glass,
        )}
      >
        <div className="flex items-center justify-between text-[11px] text-ink-soft">
          <span>{method.title}</span>
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M3 15 8 9.5l3 3L17 5M12.5 5H17v4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="relative mx-2 mt-7">
          <span className="absolute left-0 right-0 top-[5px] h-[2px] rounded-full bg-white/10" />
          <span
            className="absolute left-0 top-[5px] h-[2px] w-full origin-left rounded-full bg-acid transition-transform duration-[900ms] ease-in-out"
            style={{ transform: `scaleX(${step / 2})` }}
          />
          <ol className="relative flex justify-between">
            {method.steps.map((s, i) => (
              <li key={s.n} className={cx("flex flex-col", i === 0 ? "items-start" : i === 2 ? "items-end" : "items-center")}>
                <span
                  className={cx(
                    "relative h-3 w-3 rounded-full border-2 transition-colors duration-500",
                    step >= i ? "border-acid bg-acid" : "border-white/25 bg-[#111113]",
                  )}
                >
                  {i === 2 && step === 2 && <span className="absolute inset-0 animate-ping rounded-full bg-acid/70" />}
                </span>
                <span className={cx("mt-3 text-[12px] font-medium transition-colors duration-500", step >= i ? "text-ink" : "text-ink-mute")}>{s.title}</span>
              </li>
            ))}
          </ol>
        </div>
        <span className="absolute -bottom-4 right-4 inline-flex rotate-[4deg] items-center gap-1.5 rounded-full border border-white/10 bg-[#1B1B1E] px-3 py-1.5 text-[11.5px] text-ink shadow-[0_12px_28px_-12px_rgba(0,0,0,0.9)]">
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-acid" fill="currentColor" aria-hidden>
            <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />
          </svg>
          Express possible
        </span>
      </div>
    </div>
  );
}

/** 3. Domain and hosting: the site's address, connected and online. */
function Online() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11.5px] text-ink">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-acid/70" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-acid" />
        </span>
        Site en ligne
      </span>
      <span className="mt-4 inline-flex items-center gap-2 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold tracking-[-0.03em] text-ink">
        <svg viewBox="0 0 24 24" className="h-[0.7em] w-[0.7em] text-acid" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="5" y="10.5" width="14" height="10" rx="2" />
          <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
        </svg>
        votre-nom.com
      </span>
      <span className="mt-1 text-[11.5px] text-ink-mute">Nom de domaine</span>
      <span className="relative mt-2 h-5 w-px bg-white/15">
        <span className="pose-drop absolute -left-[1.5px] top-0 h-1 w-1 rounded-full bg-acid" />
      </span>
      <span className="grid h-5 w-5 place-items-center rounded-full border border-acid/60 text-acid">
        <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
          <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="h-5 w-px bg-white/15" />
      <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft">Hébergement</span>
    </div>
  );
}

/** 4. Changes: what you can do yourself, and what we can do for you. */
function Changes() {
  const chips = [
    {
      text: "Modifier un texte",
      who: "Par vous",
      icon: <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" strokeLinejoin="round" />,
      place: "left-[3%] top-[14%] group-hover:-translate-x-2 sm:left-[6%]",
      delay: "0s",
    },
    {
      text: "Changer une photo",
      who: "Par vous",
      icon: (
        <>
          <rect x="3.5" y="5" width="17" height="14" rx="2" />
          <path d="m4 17 5-5 4 4 2.5-2.5L20 17" strokeLinejoin="round" />
        </>
      ),
      place: "left-[8%] top-[42%] group-hover:translate-x-1 sm:left-[16%]",
      delay: "-1.6s",
    },
    {
      text: "Maintenance",
      who: "Par nous",
      icon: <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />,
      place: "left-[13%] top-[70%] group-hover:translate-x-3 sm:left-[26%]",
      delay: "-3.2s",
    },
  ];
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 -rotate-[8deg]">
        {chips.map((c) => (
          <div key={c.text} className={cx("absolute transition-transform duration-700 ease-expo", c.place)}>
            <div
              className="pose-float flex w-[min(300px,68vw)] items-center gap-3 rounded-[12px] bg-[#ECECE8] px-4 py-3 text-[#0C0C0D] shadow-[0_16px_34px_-16px_rgba(0,0,0,0.95)]"
              style={{ animationDelay: c.delay }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                {c.icon}
              </svg>
              <span className="text-[14px] font-medium">{c.text}</span>
              <span className="ml-auto text-[11px] text-[#6E6E6A]">{c.who}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const iconCls = "h-[18px] w-[18px]";
const CARDS: { art: ReactNode; icon: ReactNode; title: string; text: string; link: string; to: string }[] = [
  {
    art: <Writing />,
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M5 6h14M5 10.5h14M5 15h9" strokeLinecap="round" />
        <path d="m15.5 19 1-3.2 3.3-3.3 2.2 2.2-3.3 3.3-3.2 1Z" strokeLinejoin="round" />
      </svg>
    ),
    title: "Vos textes, écrits pour vous.",
    text: "Nous rédigeons les textes de votre site, puis vous les validez avant la mise en ligne.",
    link: "Voir la méthode",
    to: "methode",
  },
  {
    art: <Timeline />,
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M13 3 5.5 13.5H12l-1 7.5 7.5-10.5H12L13 3Z" strokeLinejoin="round" />
      </svg>
    ),
    title: "En ligne en 5 à 15 jours.",
    text: "Selon la complexité du projet. Besoin d'aller plus vite ? Une livraison express est possible, avec supplément.",
    link: "Demander un devis",
    to: "contact",
  },
  {
    art: <Online />,
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5Z" />
      </svg>
    ),
    title: "Nom de domaine et hébergement compris.",
    text: "Ils sont inclus dans le tarif. Déjà un nom de domaine ? On adapte la solution avec vous.",
    link: "Questions fréquentes",
    to: "questions",
  },
  {
    art: <Changes />,
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10" strokeLinecap="round" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </svg>
    ),
    title: "Modifiable par vous, ou par nous.",
    text: "On vous donne la main pour vos modifications, ou on s'occupe de la maintenance pour vous.",
    link: "En parler ensemble",
    to: "contact",
  },
];

/**
 * Tout est compris (the site): what the client will not have to deal with, in
 * four cards. Each has a small scene at the top (drawn in HTML, animated
 * while on screen), then its promise, taken from the FAQ, the method and the
 * pricing of the site.
 */
export function PoseIncluded({ n }: { n?: string }) {
  return (
    <section id="compris" aria-labelledby="pose-included-title" className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Rise>
              <Label n={n}>Tout est compris</Label>
            </Rise>
            <Rise delay={0.05}>
              <h2
                id="pose-included-title"
                className="mt-5 max-w-[17ch] font-display text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]"
              >
                Vous vous occupez de votre activité.
                <span className="mt-2 block font-serif text-[0.9em] font-normal italic tracking-[-0.01em] text-ink-soft">Nous, du site.</span>
              </h2>
            </Rise>
          </div>
          <Rise as="p" delay={0.1} className="max-w-[24rem] text-[17px] leading-relaxed text-ink-soft">
            Les textes, les délais, l&apos;adresse du site, les modifications : voici ce qui est prévu pour vous.
          </Rise>
        </div>

        <div className="mt-12 grid gap-4 sm:gap-5 lg:mt-16 lg:grid-cols-2">
          {CARDS.map((c, i) => (
            <Rise key={c.title} delay={(i % 2) * 0.08} blur={false}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,#131315,#0D0D0F)] transition-colors duration-500 hover:border-white/[0.16]">
                <div className="relative h-[210px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_72%,transparent)] sm:h-[250px]">
                  <span aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.028)_0_1px,transparent_1px_46px)]" />
                  <span aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_65%_at_50%_0%,rgba(255,255,255,0.07),transparent_72%)]" />
                  {c.art}
                </div>
                <div className="flex flex-1 flex-col px-6 pb-7 sm:px-8 sm:pb-8">
                  <span className="grid h-10 w-10 place-items-center rounded-[11px] border border-white/10 bg-white/[0.03] text-ink-soft">{c.icon}</span>
                  <h3 className="mt-5 font-display text-[21px] font-medium leading-snug tracking-[-0.02em] sm:text-[23px]">{c.title}</h3>
                  <p className="mt-2 max-w-[30rem] text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">{c.text}</p>
                  <button
                    type="button"
                    onClick={() => goTo(c.to)}
                    className="mt-auto inline-flex items-center gap-2 self-start pt-6 text-[14px] font-medium text-ink transition-colors hover:text-acid"
                  >
                    {c.link}
                    <Arrow className="h-4 w-4 transition-transform duration-300 ease-expo group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
