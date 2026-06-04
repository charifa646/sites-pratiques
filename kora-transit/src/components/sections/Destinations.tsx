"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { liaisons } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

export function Destinations() {
  return (
    <section className="section bg-navy-deep/40">
      <div className="shell">
        <SectionTitle number="04" title={liaisons.title} />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-12 grid gap-4 sm:grid-cols-2"
        >
          {liaisons.routes.map((r) => (
            <motion.li
              key={`${r.from}-${r.to}`}
              variants={staggerItem}
              className="group flex items-center justify-between gap-4 rounded-xl border border-line/70 bg-navy-light/30 px-6 py-5 transition-all duration-300 hover:border-gold/40 hover:bg-navy-light/60"
            >
              <span className="font-display text-base font-medium text-ink sm:text-lg">
                {r.from}
              </span>
              <ArrowLeftRight className="h-4 w-4 shrink-0 text-gold transition-transform duration-300 group-hover:scale-110" />
              <span className="text-right font-display text-base font-medium text-ink sm:text-lg">
                {r.to}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        <p className="mt-8 text-center text-sm italic text-muted">
          {liaisons.note}
        </p>
      </div>
    </section>
  );
}
