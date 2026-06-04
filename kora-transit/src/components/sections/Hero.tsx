"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { ButtonLink } from "@/components/ui/Button";
import { hero, images, site } from "@/lib/data";
import { EASE } from "@/lib/animations";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const yWord = useTransform(scrollYProgress, [0, 1], ["0%", "42%"]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <motion.div style={{ y: yBg }} className="absolute inset-0 scale-110">
        {images.heroVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={images.heroPoster}
            className="h-full w-full object-cover"
          >
            <source src={images.heroVideo} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={images.heroPoster}
            alt="Autocar KORA TRANSIT sur la route au crépuscule"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/50" />
      <AuroraBackground />

      {/* warm headlight pool */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[45vh] w-[85vw] -translate-x-1/2 translate-y-1/3 rounded-[50%] bg-gold/15 blur-[130px]" />
      {/* travelling light sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 left-0 h-[150%] w-1/3 animate-light-sweep bg-gradient-to-r from-transparent via-gold/10 to-transparent blur-2xl" />
      </div>

      <motion.span
        style={{ y: yWord }}
        aria-hidden
        className="pointer-events-none absolute -bottom-[7vw] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[34vw] font-black leading-none text-gold/[0.05]"
      >
        KORA
      </motion.span>

      <div className="shell relative z-10 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-3 rounded-full border border-gold/30 bg-gold/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-glow" />
            {site.sloganSecondaire}
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-7 text-balance text-shadow-navy text-[2.6rem] font-extrabold leading-[1.04] sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-ink/75"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <ButtonLink href="/reservation" size="lg">
              {hero.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="/services" size="lg" variant="secondary">
              {hero.ctaSecondary}
            </ButtonLink>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: cueOpacity }}
        className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
      >
        <div className="flex flex-col items-center gap-2 text-muted">
          <span className="text-[10px] uppercase tracking-[0.3em]">Défiler</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-gold" />
        </div>
      </motion.div>
    </section>
  );
}
