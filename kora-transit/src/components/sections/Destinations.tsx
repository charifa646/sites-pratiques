"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GiantText } from "@/components/ui/GiantText";
import { liaisons } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

export function Destinations() {
  return (
    <section className="section relative overflow-hidden bg-navy-deep">
      <GiantText outline className="-left-[2%] top-6 text-[16vw]">
        LIAISONS
      </GiantText>

      <div className="shell relative">
        <SectionTitle number="04" eyebrow="Destinations desservies" title={liaisons.title} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-12 grid gap-3 sm:grid-cols-2"
        >
          {liaisons.routes.map((r) => (
            <motion.div
              key={`${r.from}-${r.to}`}
              variants={staggerItem}
              className="group flex items-center justify-between rounded-xl border border-line/70 bg-navy-light/30 px-5 py-4 transition-all duration-300 hover:border-gold/40 hover:bg-navy-light/60"
            >
              <div className="flex items-center gap-3 font-display text-base font-medium text-ink">
                <span>{r.from}</span>
                <span className="h-px w-8 bg-gold/40 transition-all duration-300 group-hover:w-12" />
                <span>{r.to}</span>
              </div>
              <ArrowRight className="h-4 w-4 -translate-x-2 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-8 text-sm italic text-muted">{liaisons.note}</p>
      </div>
    </section>
  );
}
