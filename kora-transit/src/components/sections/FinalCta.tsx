"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { ButtonLink } from "@/components/ui/Button";
import { finalCta, images } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

export function FinalCta() {
  return (
    <section className="section relative overflow-hidden">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2rem] border border-line/70 px-6 py-20 text-center md:px-16 md:py-28">
          <Image
            src={images.highway}
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none object-cover opacity-20"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/90" />
          <AuroraBackground />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="relative mx-auto flex max-w-2xl flex-col items-center"
          >
            <motion.h2
              variants={staggerItem}
              className="text-balance text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl"
            >
              {finalCta.title}
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="mt-5 text-lg text-muted"
            >
              {finalCta.subtitle}
            </motion.p>
            <motion.div variants={staggerItem} className="mt-9">
              <ButtonLink href="/reservation" size="lg">
                {finalCta.cta}
              </ButtonLink>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
