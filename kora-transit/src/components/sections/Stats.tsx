"use client";

import { motion } from "framer-motion";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { Duotone } from "@/components/ui/Duotone";
import { WireGrid } from "@/components/ui/WireGrid";
import { BracketLabel } from "@/components/ui/BracketLabel";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";
import { statsHome, images, type Stat } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Stats({
  stats = statsHome,
  className,
}: {
  stats?: Stat[];
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-line/60 bg-navy-deep",
        className,
      )}
    >
      <Duotone
        src={images.scene.lightTrails}
        alt=""
        className="absolute inset-0"
        intensity="strong"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-navy-deep/72" />
      <WireGrid />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="shell relative py-16 md:py-20">
        <BracketLabel className="text-gold/70">En chiffres · KORA TRANSIT</BracketLabel>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className={cn(
            "mt-9 grid gap-x-8 gap-y-12",
            stats.length === 5
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
              : "grid-cols-2 md:grid-cols-4",
          )}
        >
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={staggerItem} className="relative">
              {i > 0 && (
                <span className="absolute -left-4 top-1.5 hidden h-[78%] w-px bg-line/70 md:block" />
              )}
              <div className="text-gradient-gold font-display text-[clamp(2.4rem,5vw,3.4rem)] font-bold leading-none tracking-tightest">
                <NumberTicker value={s.value} group={s.separator} className="text-gradient-gold" />
                {s.suffix}
              </div>
              <p className="mt-3 text-[0.8rem] uppercase tracking-[0.16em] text-muted">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
