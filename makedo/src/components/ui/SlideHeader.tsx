"use client";

import { motion } from "framer-motion";
import { agency } from "@/lib/copy";
import { EXPO, VIEW } from "@/lib/motion";
import { at, fs, merge } from "@/lib/stage";
import { BracketMark } from "./Wordmark";
import { Hairline } from "./primitives";

/** "[ агентство системного продвижения ]  ·  [ MAKEDO ]" strip of slides 2 and 3. */
export function SlideHeader() {
  return (
    <div className="relative z-20 flex items-center justify-between gap-4 px-4 pb-3 pt-4 sm:px-8 xl:contents">
      <motion.p
        className="fs at text-[13px] font-light tracking-[0.01em] text-[#9A9A9A] sm:text-base"
        style={merge(at(66, 12), fs(26.8, 1.2))}
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={VIEW}
        transition={{ duration: 0.9, ease: EXPO }}
      >
        [ {agency} ]
      </motion.p>
      <motion.div
        className="at w-[112px] shrink-0 text-white sm:w-[150px]"
        style={at(1653, 12, 197)}
        initial={{ opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={VIEW}
        transition={{ duration: 0.9, ease: EXPO, delay: 0.1 }}
      >
        <BracketMark className="block h-auto w-full" />
      </motion.div>
      <Hairline className="at absolute inset-x-0 bottom-0" style={at(-1200, 55, 4400, "1px")} />
    </div>
  );
}
