"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { about } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

export function Values() {
  return (
    <section className="section">
      <div className="shell">
        <SectionTitle title={about.valuesTitle} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {about.values.map((v) => (
            <motion.div
              key={v.title}
              variants={staggerItem}
              className="group glass rounded-2xl p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-card"
            >
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-navy-deep">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-ink">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{v.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
