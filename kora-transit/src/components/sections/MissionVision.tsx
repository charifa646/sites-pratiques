"use client";

import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { about } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

const blocks = [
  { icon: Target, ...about.mission },
  { icon: Eye, ...about.vision },
];

export function MissionVision() {
  return (
    <section className="section bg-navy-deep/40">
      <div className="shell">
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
              className="glass relative overflow-hidden rounded-2xl p-9"
            >
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">{b.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-muted">{b.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
