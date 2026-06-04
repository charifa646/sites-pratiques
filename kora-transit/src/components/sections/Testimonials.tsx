"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { testimonials } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

export function Testimonials() {
  return (
    <section className="section relative overflow-hidden bg-navy-deep/40">
      <div className="shell">
        <SectionTitle number="04" eyebrow="Témoignages" title={testimonials.title} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-14 grid gap-6 lg:grid-cols-3"
        >
          {testimonials.items.map((t) => (
            <motion.figure
              key={t.name}
              variants={staggerItem}
              className="group glass flex flex-col rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-card"
            >
              <Quote className="h-8 w-8 text-gold/70" />
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-ink/90">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display font-semibold text-gold">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-ink">{t.name}</p>
                  <p className="text-sm text-muted">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
