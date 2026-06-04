"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Users, Star } from "lucide-react";
import { fleet } from "@/lib/data";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

export function FleetClasses() {
  return (
    <section className="section">
      <div className="shell">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid items-start gap-6 lg:grid-cols-3"
        >
          {fleet.map((f) => (
            <TiltCard
              key={f.name}
              variants={staggerItem}
              intensity={7}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-navy-light/30",
                f.featured
                  ? "border-gold/60 shadow-gold-sm lg:-mt-4"
                  : "border-line/70 hover:border-gold/40",
              )}
            >
              {f.badge && (
                <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold text-navy-deep">
                  <Star className="h-3 w-3 fill-navy-deep" />
                  {f.badge}
                </div>
              )}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={f.image}
                  alt={f.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-light to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                  {f.tier}
                </span>
                <h3 className="mt-2 font-display text-2xl font-bold">{f.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.description}</p>

                <div className="mt-5 flex items-center gap-2 text-sm text-ink">
                  <Users className="h-4 w-4 text-gold" />
                  <span className="font-medium">{f.capacity}</span>
                </div>

                <div className="my-6 h-px bg-line/70" />

                <ul className="flex flex-col gap-3">
                  {f.equipment.map((e) => (
                    <li key={e} className="flex items-center gap-3 text-sm text-ink/85">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                        <Check className="h-3 w-3" />
                      </span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
