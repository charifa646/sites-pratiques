"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { WireGrid } from "@/components/ui/WireGrid";
import { GiantText } from "@/components/ui/GiantText";
import { whyUs } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

export function WhyUs() {
  return (
    <section className="section relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-24 h-[40rem] w-[40rem] rounded-full bg-gold/[0.06] blur-[160px]" />
      <WireGrid />
      <GiantText outline className="-right-[3%] top-4 text-[16vw]">
        STANDARD
      </GiantText>

      <div className="shell relative">
        <SectionTitle
          number="02"
          eyebrow="Pourquoi KORA TRANSIT"
          title={whyUs.title}
          intro={whyUs.subtitle}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {whyUs.items.map((it, i) => (
            <motion.div
              key={it.title}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-2xl border border-line/70 bg-navy-light/40 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40"
            >
              <span className="absolute right-5 top-5 font-mono text-xs text-ink/20">
                0{i + 1}
              </span>
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-navy-deep">
                <it.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{it.desc}</p>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
