"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRef, type PointerEvent } from "react";
import { problems } from "@/lib/copy";
import { EXPO, VIEW, rise } from "@/lib/motion";
import { at, fs, merge } from "@/lib/stage";
import { SlideHeader } from "@/components/ui/SlideHeader";
import { SelectionBox } from "@/components/ui/SelectionBox";
import { Hairline, Lines, Mask, Node, cx } from "@/components/ui/primitives";

const ProblemsScene = dynamic(() => import("@/components/three/ProblemsScene"), { ssr: false });

/** Card boxes measured on the mockup. */
const CARDS: [number, number, number, number][] = [
  [672, 462, 571, 260],
  [1283, 462, 570, 260],
  [672, 757, 571, 261],
  [1283, 757, 570, 261],
];

const SCENE_BOX = at(0, 56, 1000, 1036);

function spotlight(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Problems() {
  const selectionRef = useRef<HTMLDivElement>(null);
  const words = problems.title.lead.split(" ");
  const accent = problems.title.accent.split(" ");

  return (
    <section aria-labelledby="problems-title" className="bg-problems grain relative isolate overflow-hidden">
      <div className="stage flex flex-col pb-16 sm:pb-20 xl:block xl:pb-0">
        <SlideHeader />

        {/* Construction grid (desktop stage) */}
        <div aria-hidden className="hidden xl:contents">
          {[57, 657, 1261, 1869].map((x, i) => (
            <Hairline key={x} dir="y" className="at" style={at(x, -400, "1px", 1900)} delay={0.1 * i} />
          ))}
          {[448, 740, 1030].map((y, i) => (
            <Hairline key={y} className="at" style={at(-1200, y, 4400, "1px")} delay={0.15 + 0.1 * i} />
          ))}
          {[
            [657, 448],
            [1261, 448],
            [657, 740],
            [1261, 740],
          ].map(([x, y], i) => (
            <Node key={`${x}-${y}`} className="at z-[15]" style={at(x, y)} delay={0.6 + i * 0.08} />
          ))}
        </div>

        {/* Eyebrow + headline */}
        <motion.p
          className="fs at relative z-10 mt-12 px-4 font-display text-[11px] tracking-[0.3em] text-white/40 sm:px-8 xl:px-0"
          style={merge(at(90, 218), fs(14.5, 1.2, 9))}
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={VIEW}
        >
          {problems.eyebrow}
        </motion.p>
        <h2
          id="problems-title"
          className="fs at relative z-10 mt-4 px-4 font-display text-[clamp(1.6rem,7.4vw,3.2rem)] font-normal leading-[1.08] tracking-[-0.01em] text-white sm:px-8 xl:whitespace-nowrap xl:px-0"
          style={merge(at(88, 258), fs(56.5, 1.1))}
        >
          {words.map((w, i) => (
            <Mask key={i} inline delay={0.08 * i} className="pb-[0.12em]">
              {w}
              {" "}
            </Mask>
          ))}
          {accent.map((w, i) => (
            <Mask
              key={`a${i}`}
              inline
              delay={0.08 * (words.length + i) + 0.05}
              className="pb-[0.12em]"
              innerClassName="text-ember-soft"
            >
              {w}
              {i < accent.length - 1 ? " " : null}
            </Mask>
          ))}
        </h2>

        {/* 3D: hand holding the black strawberry, crystal strawberry on the floor */}
        <div className="relative mt-2 h-[112vw] max-h-[760px] sm:h-[86vw] xl:contents">
          <div
            aria-hidden
            className="floor-pool at pointer-events-none absolute -left-[12%] bottom-[2%] h-[30%] w-[78%]"
            style={at(-150, 760, 760, 330)}
          />
          <div className="at absolute inset-0" style={SCENE_BOX}>
            <ProblemsScene selectionRef={selectionRef} />
          </div>
          <div className="at pointer-events-none absolute inset-0 z-20" style={SCENE_BOX}>
            <SelectionBox ref={selectionRef} />
          </div>
        </div>

        {/* Subtitle */}
        <motion.p
          className="fs at relative z-10 mt-2 px-4 text-lg font-light leading-snug text-mist sm:px-8 sm:text-2xl xl:whitespace-nowrap xl:px-0"
          style={merge(at(705, 371), fs(35.8, 1.2))}
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={VIEW}
          custom={0.2}
        >
          {problems.subtitle}
        </motion.p>

        {/* Problem cards */}
        <div className="relative z-10 mt-8 grid gap-3 px-4 sm:grid-cols-2 sm:gap-4 sm:px-8 xl:contents">
          {problems.cards.map((c, i) => {
            const [x, y, w, h] = CARDS[i];
            return (
              <motion.article
                key={i}
                onPointerMove={spotlight}
                className={cx(
                  "card at group relative overflow-hidden p-5 sm:p-6",
                  "xl:pl-[calc(var(--u)*33)] xl:pr-[calc(var(--u)*24)] xl:pt-[calc(var(--u)*28)]",
                )}
                style={at(x, y, w, h)}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 1, delay: 0.12 * i, ease: EXPO }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(242,87,34,0.16), transparent 60%)",
                  }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 border border-white/[0.07] transition-colors duration-500 group-hover:border-ember/40"
                />
                <h3 className="fs relative text-lg font-semibold leading-snug text-white sm:text-xl" style={fs(31.2, 1.25)}>
                  <Lines lines={c.title} />
                </h3>
                <p
                  className="fs relative mt-3 text-[15px] leading-relaxed text-smoke xl:mt-[calc(var(--u)*12)]"
                  style={fs(22.9, 1.27)}
                >
                  <Lines lines={c.text} />
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
