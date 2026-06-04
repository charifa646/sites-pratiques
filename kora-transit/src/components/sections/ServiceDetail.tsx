"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ServiceDetail as ServiceDetailType } from "@/lib/data";
import {
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
  VIEWPORT,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

export function ServiceDetail({
  service,
  index = 1,
  reverse = false,
}: {
  service: ServiceDetailType;
  index?: number;
  reverse?: boolean;
}) {
  const num = String(index).padStart(2, "0");
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Media + giant number the image lands on */}
      <motion.div
        variants={reverse ? slideInRight : slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className={cn("relative", reverse && "lg:order-2")}
      >
        <span
          aria-hidden
          className="text-stroke-ink absolute -left-2 -top-12 z-0 select-none font-display text-[7rem] font-bold leading-none tracking-tightest opacity-50 lg:text-[10rem]"
        >
          {num}
        </span>
        <div className="relative z-10 aspect-[4/3] overflow-hidden rounded-2xl border border-line/70">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1200ms] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy/20 to-transparent" />
          <span className="absolute left-5 top-5 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-ink/70">
            [ {num} ]
          </span>
        </div>
        <div className="pointer-events-none absolute -bottom-6 left-1/2 h-24 w-2/3 -translate-x-1/2 rounded-full bg-gold/15 blur-[60px]" />
      </motion.div>

      {/* Copy */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className={cn(reverse && "lg:order-1")}
      >
        <motion.span
          variants={staggerItem}
          className="text-xs font-semibold uppercase tracking-[0.25em] text-gold"
        >
          {service.label}
        </motion.span>
        <motion.h3
          variants={staggerItem}
          className="mt-3 font-display text-[clamp(1.9rem,3.5vw,2.8rem)] font-semibold tracking-tightest text-ink"
        >
          {service.title}
        </motion.h3>
        <motion.p
          variants={staggerItem}
          className="mt-5 text-base leading-relaxed text-muted"
        >
          {service.description}
        </motion.p>
        <motion.ul variants={staggerItem} className="mt-7 grid gap-3 sm:grid-cols-2">
          {service.points.map((p) => (
            <li
              key={p}
              className="flex items-start gap-3 rounded-lg border border-line/50 bg-navy-light/30 p-3 text-sm text-ink/90"
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                <Check className="h-3 w-3" />
              </span>
              {p}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
}
