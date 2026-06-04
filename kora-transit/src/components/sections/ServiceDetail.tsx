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
  reverse = false,
}: {
  service: ServiceDetailType;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <motion.div
        variants={reverse ? slideInRight : slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-2xl border border-line/70",
          reverse && "lg:order-2",
        )}
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
      </motion.div>

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
          className="mt-3 text-3xl font-bold sm:text-4xl"
        >
          {service.title}
        </motion.h3>
        <motion.p
          variants={staggerItem}
          className="mt-5 text-base leading-relaxed text-muted"
        >
          {service.description}
        </motion.p>
        <motion.ul
          variants={staggerItem}
          className="mt-7 grid gap-3 sm:grid-cols-2"
        >
          {service.points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm text-ink/90">
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
