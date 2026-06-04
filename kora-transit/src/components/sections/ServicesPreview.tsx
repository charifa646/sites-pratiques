"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ButtonLink } from "@/components/ui/Button";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { TiltCard } from "@/components/ui/TiltCard";
import { servicesPreview } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function ServicesPreview() {
  return (
    <section className="section relative overflow-hidden">
      <AuroraBackground />
      <div className="shell relative">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle
            number="02"
            eyebrow="Nos services"
            title={servicesPreview.title}
            className="md:max-w-2xl"
          />
          <div className="hidden shrink-0 md:block">
            <ButtonLink href="/services" variant="secondary">
              {servicesPreview.cta}
            </ButtonLink>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-14 grid gap-5 lg:auto-rows-[15rem] lg:grid-cols-3"
        >
          {servicesPreview.items.map((it, i) => {
            const big = i === 0;
            return (
              <TiltCard
                key={it.title}
                variants={staggerItem}
                intensity={6}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-line/70",
                  big ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-1",
                )}
              >
                <Link href="/services" className="block h-full">
                  <div className={cn("relative h-full", big ? "min-h-[22rem]" : "min-h-[15rem]")}>
                    <Image
                      src={it.image}
                      alt={it.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/65 to-navy/10" />
                    <div className="absolute inset-0 bg-gold/0 transition-colors duration-500 group-hover:bg-gold/[0.06]" />
                    <div className="relative flex h-full flex-col justify-end p-7">
                      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-navy/60 text-gold backdrop-blur">
                        <it.icon className="h-5 w-5" />
                      </div>
                      <h3 className={cn("font-semibold text-ink", big ? "text-2xl" : "text-xl")}>
                        {it.title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/70">
                        {it.desc}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gold opacity-0 transition-all duration-300 group-hover:opacity-100">
                        Découvrir <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            );
          })}
        </motion.div>

        <div className="mt-10 md:hidden">
          <ButtonLink href="/services" variant="secondary" className="w-full">
            {servicesPreview.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
