"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { about } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

export function Team() {
  return (
    <section className="section bg-navy-deep/40">
      <div className="shell">
        <SectionTitle title={about.teamTitle} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {about.team.map((m) => (
            <motion.div
              key={m.name}
              variants={staggerItem}
              className="group glass flex flex-col items-center rounded-2xl p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-card"
            >
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
                <div className="relative grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-navy-light to-navy font-display text-2xl font-bold text-gold">
                  {m.initials}
                </div>
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">
                {m.name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {m.role}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
