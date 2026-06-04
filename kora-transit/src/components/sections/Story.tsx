"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { about, images } from "@/lib/data";
import { slideInRight, staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

export function Story() {
  return (
    <section className="section">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.span
            variants={staggerItem}
            className="text-xs font-semibold uppercase tracking-[0.28em] text-gold"
          >
            Depuis 2012
          </motion.span>
          <motion.h2
            variants={staggerItem}
            className="mt-3 text-3xl font-bold sm:text-4xl"
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
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
          </div>
          <div className="absolute -bottom-8 -left-8 hidden w-44 overflow-hidden rounded-xl border border-gold/40 shadow-card sm:block">
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
