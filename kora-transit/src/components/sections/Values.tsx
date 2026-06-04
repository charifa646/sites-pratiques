"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GiantText } from "@/components/ui/GiantText";
import { about } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

export function Values() {
  return (
    <section className="section relative overflow-hidden">
      <GiantText outline className="-right-[2%] top-8 text-[15vw]">
        VALEURS
      </GiantText>

      <div className="shell relative">
        <SectionTitle number="04" eyebrow="Ce qui nous guide" title={about.valuesTitle} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {about.values.map((v, i) => (
            <motion.div
              key={v.title}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-2xl border border-line/70 bg-navy-light/40 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40"
            >
              <span className="absolute right-5 top-5 font-mono text-xs text-ink/20">
                0{i + 1}
              </span>
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-navy-deep">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{v.desc}</p>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
