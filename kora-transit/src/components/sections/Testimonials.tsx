"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GiantText } from "@/components/ui/GiantText";
import { Duotone } from "@/components/ui/Duotone";
import { testimonials, images } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function Testimonials() {
  return (
    <section className="section cv-auto relative overflow-hidden">
      <Duotone
        src={images.scene.terminalNight}
        alt=""
        className="absolute inset-0"
        intensity="strong"
      />
      <div className="absolute inset-0 bg-navy-deep/80" />
      <GiantText className="-left-[2%] bottom-2 text-[15vw]">CONFIANCE</GiantText>

      <div className="shell relative">
        <SectionTitle number="05" eyebrow="Témoignages" title={testimonials.title} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-14 grid gap-5 lg:grid-cols-3"
        >
          {testimonials.items.map((t, i) => (
            <motion.figure
              key={t.name}
              variants={staggerItem}
              className={cn(
                "group glass relative flex flex-col rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40",
                i === 1 && "lg:-mt-6 lg:border-gold/30",
              )}
            >
              <div className="flex items-center justify-between">
                <Quote className="h-8 w-8 text-gold/70" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
              </div>
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-ink/90">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4 border-t border-line/60 pt-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display text-sm font-semibold text-gold">
                  {t.initials}
                </div>
                <div>
                  <p className="font-display font-semibold text-ink">{t.name}</p>
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
