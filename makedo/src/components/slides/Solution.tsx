"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { solution } from "@/lib/copy";
import { EXPO, VIEW, rise } from "@/lib/motion";
import { at, fs, merge } from "@/lib/stage";
import { SlideHeader } from "@/components/ui/SlideHeader";
import { Hairline, Lines, Mask, cx } from "@/components/ui/primitives";

const SolutionScene = dynamic(() => import("@/components/three/SolutionScene"), { ssr: false });

/** Column geometry measured on the mockup band (y 654 → 1030). */
const COLS = [
  { x: 75, box: 367 },
  { x: 540, box: 820 },
  { x: 985, box: 1277 },
  { x: 1445, box: 1727 },
];

/** Orange rule with glowing end nodes, drawn left to right. */
function Rule() {
  return (
    <div
      aria-hidden
      className="at relative z-10 mx-4 mt-8 h-8 sm:mx-8 xl:mx-0"
      style={at(52, 398, 726, 56)}
    >
      <motion.span
        className="absolute inset-x-[2%] top-1/2 h-10 -translate-y-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(242,87,34,0.55),transparent_70%)] blur-xl"
        initial={{ opacity: 0, scaleX: 0.3 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={VIEW}
        transition={{ duration: 1.6, delay: 0.3, ease: EXPO }}
      />
      <motion.span
        className="absolute left-[10px] right-[10px] top-1/2 h-[2px] -translate-y-1/2 origin-left bg-gradient-to-r from-[#ffd9c9] via-[#ffb59a] to-[#ffd9c9] shadow-[0_0_12px_rgba(242,87,34,0.9)]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEW}
        transition={{ duration: 1.4, delay: 0.2, ease: EXPO }}
      />
      {["left-[10px]", "right-[10px]"].map((pos, i) => (
        <motion.span
          key={pos}
          className={cx(
            "absolute top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full bg-[#fff1ea] shadow-[0_0_14px_4px_rgba(242,87,34,0.75)]",
            pos,
            i === 0 ? "-translate-x-1/2" : "translate-x-1/2",
          )}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEW}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: i === 0 ? 0.15 : 1.3 }}
        />
      ))}
    </div>
  );
}

export function Solution() {
  return (
    <section aria-labelledby="solution-title" className="bg-solution grain relative isolate overflow-hidden">
      <div className="stage flex flex-col pb-10 xl:block xl:pb-0">
        <SlideHeader />

        {/* Frame + band construction lines (desktop stage) */}
        <div aria-hidden className="hidden xl:contents">
          {[57, 1870].map((x, i) => (
            <Hairline key={x} dir="y" className="at" style={at(x, -400, "1px", 1900)} delay={0.1 * i} />
          ))}
          {[654, 811, 1030].map((y, i) => (
            <Hairline key={y} className="at z-10" style={at(-1200, y, 4400, "1px")} delay={0.1 * i} />
          ))}
          {[358, 513, 811, 964, 1267, 1420, 1718].map((x, i) => (
            <Hairline key={`t${x}`} dir="y" className="at z-10" style={at(x, 654, "1px", 157)} delay={0.3 + 0.06 * i} />
          ))}
          {[513, 964, 1420].map((x, i) => (
            <Hairline key={`d${x}`} dir="y" className="at z-10" style={at(x, 811, "1px", 219)} delay={0.5 + 0.08 * i} />
          ))}
        </div>

        {/* Headline */}
        <h2
          id="solution-title"
          className="fs at relative z-10 mt-12 px-4 font-display text-[clamp(1.55rem,7vw,3.1rem)] font-normal leading-[1.1] tracking-[-0.01em] text-white sm:px-8 xl:whitespace-nowrap xl:px-0"
          style={merge(at(73, 243), fs(57, 1))}
        >
          <Mask className="pb-[0.1em]">{solution.title.line1}</Mask>
          <Mask delay={0.12} className="pb-[0.1em]">
            {solution.title.lead} <span className="text-ember-soft">{solution.title.accent}</span>
          </Mask>
        </h2>

        <Rule />

        <motion.p
          className="fs at relative z-10 mt-4 px-4 text-lg font-light leading-snug text-mist sm:px-8 sm:text-2xl xl:whitespace-nowrap xl:px-0"
          style={merge(at(75, 474), fs(35.9, 1.2))}
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={VIEW}
          custom={0.35}
        >
          {solution.subtitle}
        </motion.p>

        {/* 3D: faceted crystal apple, arrow, pedestal */}
        <div className="relative mt-4 h-[104vw] max-h-[640px] xl:contents">
          <div
            className="at absolute inset-0 [mask-image:linear-gradient(to_bottom,black_58%,transparent_92%)]"
            style={at(1040, 20, 886, 900)}
          >
            <SolutionScene />
          </div>
        </div>

        {/* Steps band */}
        <ol className="relative z-20 mx-4 border-t border-white/[0.13] sm:mx-8 sm:grid sm:grid-cols-2 xl:contents">
          {solution.steps.map((s, i) => {
            const c = COLS[i];
            return (
              <li
                key={s.n}
                className="group relative grid grid-cols-[1fr_auto] items-start gap-x-4 border-b border-white/[0.13] py-5 sm:px-4 sm:odd:border-r xl:contents"
              >
                <motion.h3
                  className="fs at text-lg font-semibold leading-snug text-white sm:text-xl xl:transition-colors xl:duration-500"
                  style={merge(at(c.x, 691), fs(30.6, 1.27))}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEW}
                  transition={{ duration: 0.9, delay: 0.1 * i, ease: EXPO }}
                >
                  <Lines lines={s.title} />
                </motion.h3>
                <motion.div
                  aria-hidden
                  className="at relative flex h-16 w-16 items-center justify-center bg-[#2B2B2B] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition-[box-shadow,background-color] duration-500 group-hover:bg-[#301f19] group-hover:shadow-[inset_0_0_0_1px_rgba(242,87,34,0.55),0_0_40px_-8px_rgba(242,87,34,0.45)] sm:h-20 sm:w-20"
                  style={at(c.box, 664, 136, 136)}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={VIEW}
                  transition={{ duration: 0.9, delay: 0.15 + 0.1 * i, ease: EXPO }}
                >
                  <Mask
                    delay={0.35 + 0.12 * i}
                    className="font-light tabular-nums tracking-[0.02em] text-ember-soft/90 transition-colors duration-500 group-hover:text-ember"
                  >
                    <span style={fs(50, 1)} className="fs block text-3xl leading-none">
                      {s.n}
                    </span>
                  </Mask>
                </motion.div>
                <motion.p
                  className="fs at col-span-2 mt-3 text-[15px] leading-relaxed text-smoke"
                  style={merge(at(c.x, 845), fs(23.5, 1.234))}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={VIEW}
                  transition={{ duration: 1, delay: 0.25 + 0.1 * i, ease: EXPO }}
                >
                  <Lines lines={s.text} />
                </motion.p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
