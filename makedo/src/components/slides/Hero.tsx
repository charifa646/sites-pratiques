"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { hero } from "@/lib/copy";
import { at, fs, merge } from "@/lib/stage";
import { Wordmark } from "@/components/ui/Wordmark";
import { GridOverlay, edgesOf, type Rect } from "@/components/ui/GridOverlay";
import { BracketArms, Hairline, Mask, Scramble, cx } from "@/components/ui/primitives";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

type Tone = "dark" | "clear" | "glass" | "frost";
type Cell = Rect & { label?: number; pos?: "center" | "bl" | "tr"; tone: Tone; blur?: number };

/** Cell grid measured on the mockup (1926 × 1092). */
const CELLS: Cell[] = [
  { x: 52, y: 42, w: 236, h: 233, label: 0, pos: "center", tone: "dark" },
  { x: 1013, y: 42, w: 247, h: 233, label: 1, pos: "center", tone: "frost", blur: 9 },
  { x: 766, y: 275, w: 247, h: 233, tone: "glass", blur: 3 },
  { x: 1013, y: 275, w: 247, h: 233, tone: "clear" },
  { x: 1260, y: 275, w: 608, h: 233, tone: "dark" },
  { x: 525, y: 508, w: 241, h: 232, label: 2, pos: "center", tone: "glass", blur: 6 },
  { x: 766, y: 508, w: 247, h: 232, tone: "clear" },
  { x: 1013, y: 508, w: 247, h: 232, label: 4, pos: "bl", tone: "clear" },
  { x: 1260, y: 508, w: 248, h: 232, label: 3, pos: "tr", tone: "glass", blur: 6 },
  { x: 1508, y: 508, w: 360, h: 232, label: 5, pos: "bl", tone: "dark" },
  { x: 766, y: 740, w: 494, h: 295, label: 6, pos: "bl", tone: "frost", blur: 16 },
  { x: 1260, y: 740, w: 248, h: 295, tone: "glass", blur: 8 },
  { x: 1508, y: 740, w: 360, h: 295, label: 7, pos: "bl", tone: "dark" },
];

const SEGMENTS = edgesOf(CELLS);

const LABEL_POS = {
  center: "xl:inset-0 xl:flex xl:items-center xl:justify-center",
  bl: "xl:left-[calc(var(--u)*26)] xl:bottom-[calc(var(--u)*22)]",
  tr: "xl:left-auto xl:bottom-auto xl:right-[calc(var(--u)*24)] xl:top-[calc(var(--u)*18)]",
};

/** Mobile order of the labelled cells follows the copy order. */
const labelled = CELLS.filter((c) => c.label !== undefined).sort((a, b) => a.label! - b.label!);
const unlabelled = CELLS.filter((c) => c.label === undefined);

function CellBox({ c, i }: { c: Cell; i: number }) {
  const label = c.label !== undefined ? hero.services[c.label] : null;
  return (
    <motion.div
      data-tone={c.tone}
      className={cx(
        "cell at group relative h-[4.25rem] border-l border-t border-white/[0.16] sm:h-24 xl:h-auto xl:border-0",
        !label && "hidden xl:block",
      )}
      style={c.blur ? merge(at(c.x, c.y, c.w, c.h), { "--blur": `${c.blur}px` }) : at(c.x, c.y, c.w, c.h)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 1, delay: 0.25 + i * 0.05, ease: "easeOut" }}
    >
      {/* hover: orange registration ticks */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[6px] opacity-0 transition duration-500 ease-expo group-hover:inset-[10px] group-hover:opacity-100"
      >
        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-ember" />
        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-ember" />
        <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-ember" />
        <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-ember" />
      </span>
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-white/0 transition duration-500 group-hover:bg-white/[0.05]" />
      {label && (
        <span
          className={cx(
            "fs absolute bottom-3 left-3.5 text-[13px] tracking-[0.01em] text-[#ABABAB] transition-colors duration-500 group-hover:text-white sm:text-sm",
            LABEL_POS[c.pos ?? "bl"],
          )}
          style={fs(22, 1.2)}
        >
          <Scramble text={`[${label}]`} delay={0.6 + i * 0.07} />
        </span>
      )}
    </motion.div>
  );
}

export function Hero() {
  return (
    <section aria-label="MAKEDO" className="bg-hero grain relative isolate overflow-hidden">
      <div className="stage flex min-h-[100svh] flex-col px-4 pb-4 pt-5 sm:px-8 sm:pb-8 xl:block xl:min-h-0 xl:p-0">
        {/* 3D: glossy hand + monarch butterfly (behind the glass cells) */}
        <div className="at pointer-events-auto absolute inset-0" style={at(330, 0, 1300, 1092)}>
          <HeroScene />
        </div>

        {/* Frame construction lines, bleeding past the stage */}
        <Hairline className="at absolute inset-x-0 top-3" tone="bg-white/[0.09]" style={at(-1200, 42, 4400, "1px")} />
        <Hairline className="at absolute inset-x-0 bottom-3" tone="bg-white/[0.09]" style={at(-1200, 1035, 4400, "1px")} delay={0.15} from="end" />
        <Hairline dir="y" className="at absolute inset-y-0 left-3" tone="bg-white/[0.09]" style={at(52, -600, "1px", 2400)} delay={0.1} />
        <Hairline dir="y" className="at absolute inset-y-0 right-3" tone="bg-white/[0.09]" style={at(1868, -600, "1px", 2400)} delay={0.2} from="end" />

        {/* Wordmark */}
        <h1 className="at relative z-10 mt-10 w-full max-w-[640px] text-white sm:mt-14 xl:max-w-none" style={at(99.6, 344.3, 867.7)}>
          <Wordmark draw delay={0.35} className="block h-auto w-full" />
        </h1>

        {/* Tagline in orange brackets */}
        <p
          className={cx(
            "fs at relative z-10 mt-6 self-start px-[1.1em] py-[0.45em] text-[17px] font-light leading-[1.25] text-[#D2D2D2] sm:text-[22px]",
            "xl:pb-0 xl:pl-[calc(var(--u)*46)] xl:pr-0 xl:pt-[calc(var(--u)*8)]",
          )}
          style={merge(at(1335, 345, 482, 116), fs(37, 1.18))}
        >
          <BracketArms />
          {hero.tagline.map((l, i) => (
            <Mask key={i} delay={0.7 + i * 0.1}>
              {l}
            </Mask>
          ))}
        </p>

        <div className="min-h-[36svh] flex-1 xl:hidden" />

        {/* Intro paragraph */}
        <p
          className="fs at relative z-10 order-last mt-6 max-w-[34ch] text-[15px] leading-[1.35] text-[#D0D0D0] sm:text-lg xl:order-none xl:max-w-none"
          style={merge(at(115, 840), fs(27.5, 1.2))}
        >
          {hero.intro.map((l, i) => (
            <Mask key={i} delay={0.9 + i * 0.1} className="pb-[0.06em]">
              {l}
            </Mask>
          ))}
        </p>

        {/* Service cells: 2/4-col grid on small screens, measured grid on the stage */}
        <div className="relative z-[5] grid grid-cols-2 border-b border-r border-white/[0.16] sm:grid-cols-4 xl:contents">
          {labelled.map((c, i) => (
            <CellBox key={`l${i}`} c={c} i={i} />
          ))}
          {unlabelled.map((c, i) => (
            <CellBox key={`u${i}`} c={c} i={labelled.length + i} />
          ))}
        </div>

        {/* Cell borders (desktop stage), drawn above the frosted fills */}
        <GridOverlay segments={SEGMENTS} className="z-[6] hidden xl:block" delay={0.2} />
      </div>

      <div aria-hidden className="veil pointer-events-none absolute inset-0 z-50 bg-ink" />
    </section>
  );
}
