"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
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
      className={cn("relative overflow-hidden border-y border-line/50", className)}
    >
      <AuroraBackground image={images.scene.lightTrails} imageOpacity={0.16} />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className={cn(
          "shell relative grid gap-x-8 gap-y-12 py-16 md:py-20",
          stats.length === 5
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
            : "grid-cols-2 md:grid-cols-4",
        )}
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={staggerItem}
            className="text-center md:text-left"
          >
            <div className="font-display text-4xl font-extrabold tracking-tight text-gold sm:text-5xl lg:text-[3.25rem]">
              <AnimatedCounter
                value={s.value}
                suffix={s.suffix}
                separator={s.separator}
              />
            </div>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
