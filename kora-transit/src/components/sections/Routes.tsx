"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { liaisons } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT, EASE } from "@/lib/animations";

export function Routes() {
  const routes = liaisons.routes.slice(0, 6);

  return (
    <section className="section relative overflow-hidden">
      <div className="shell">
        <SectionTitle number="03" title={liaisons.title} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-14 grid gap-5 sm:grid-cols-2"
        >
          {routes.map((r, i) => (
            <motion.div
              key={`${r.from}-${r.to}`}
              variants={staggerItem}
              className="group glass rounded-2xl p-6 transition-all duration-500 hover:border-gold/40 hover:shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
                    Départ
                  </span>
                  <span className="font-display text-lg font-semibold text-ink">
                    {r.from}
                  </span>
                </div>

                <div className="relative mx-1 flex-1">
                  <div className="flex items-center">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={VIEWPORT}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}
                      className="h-px flex-1 origin-left bg-gradient-to-r from-gold/40 via-gold/70 to-gold/40"
                    />
                    <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
                  </div>
                  <motion.span
                    aria-hidden
                    initial={{ left: "0%", opacity: 0 }}
                    whileInView={{ left: "100%", opacity: [0, 1, 1, 0] }}
                    viewport={VIEWPORT}
                    transition={{
                      duration: 2.4,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 1,
                      delay: 0.5 + i * 0.12,
                    }}
                    className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gold shadow-gold-sm"
                  />
                </div>

                <div className="flex flex-col text-right">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
                    Arrivée
                  </span>
                  <span className="font-display text-lg font-semibold text-ink">
                    {r.to}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-sm italic text-muted">
          {liaisons.note}
        </p>
      </div>
    </section>
  );
}
