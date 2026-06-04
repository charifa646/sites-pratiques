"use client";

import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { about } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

const blocks = [
  { icon: Target, n: "02", ...about.mission },
  { icon: Eye, n: "03", ...about.vision },
];

export function MissionVision() {
  return (
    <section className="section relative overflow-hidden bg-navy-deep">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[140px]" />
      <div className="shell relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid gap-6 md:grid-cols-2"
        >
          {blocks.map((b) => (
            <motion.div
              key={b.title}
              variants={staggerItem}
              className="glass group relative overflow-hidden rounded-2xl p-9"
            >
              <span className="absolute right-7 top-6 font-display text-5xl font-bold text-ink/[0.06]">
                {b.n}
              </span>
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tightest text-ink">
                {b.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted">{b.text}</p>
              <span className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
