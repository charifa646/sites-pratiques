"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GiantText } from "@/components/ui/GiantText";
import { about, images } from "@/lib/data";
import { slideInRight, staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

export function Story() {
  return (
    <section className="section relative overflow-hidden">
      <GiantText outline className="-right-[3%] top-10 text-[18vw]">
        2012
      </GiantText>

      <div className="shell relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div variants={staggerItem} className="flex items-center gap-4">
            <span className="font-display text-sm font-semibold text-gold">(01)</span>
            <span className="h-px w-10 bg-gold/40" />
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-muted">
              Depuis 2012
            </span>
          </motion.div>
          <motion.h2
            variants={staggerItem}
            className="mt-5 font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold tracking-tightest text-ink"
          >
            {about.story.title}
          </motion.h2>
          {about.story.paragraphs.map((p) => (
            <motion.p
              key={p.slice(0, 24)}
              variants={staggerItem}
              className="mt-5 text-base leading-relaxed text-muted"
            >
              {p}
            </motion.p>
          ))}
        </motion.div>

        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="relative"
        >
          <div className="bg-radial-gold pointer-events-none absolute -inset-10 -z-10" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line/70">
            <Image
              src={images.about.story}
              alt="Route d'Afrique de l'Ouest au crépuscule"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 to-transparent" />
          </div>
          <div className="edge-glow absolute -bottom-8 -left-8 hidden w-44 overflow-hidden rounded-xl border border-gold/40 sm:block">
            <div className="relative aspect-square">
              <Image
                src={images.about.terminal}
                alt="Autocar moderne KORA TRANSIT"
                fill
                sizes="180px"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
