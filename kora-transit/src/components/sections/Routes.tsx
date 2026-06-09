"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GiantText } from "@/components/ui/GiantText";
import { WireGrid } from "@/components/ui/WireGrid";
import { DottedMap, type Marker } from "@/components/ui/DottedMap";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/ScrollVelocity";
import { liaisons } from "@/lib/data";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/animations";

// KORA network — West African cities [lat, lng].
const NETWORK: Marker[] = [
  { lat: 12.37, lng: -1.53, size: 1.5, pulse: true }, // Ouagadougou
  { lat: 11.18, lng: -4.3, size: 1.1 }, // Bobo-Dioulasso
  { lat: 5.36, lng: -4.01, size: 1.3, pulse: true }, // Abidjan
  { lat: 12.64, lng: -8.0, size: 1.1 }, // Bamako
  { lat: 5.6, lng: -0.19, size: 1.1 }, // Accra
  { lat: 14.69, lng: -17.44, size: 1.2, pulse: true }, // Dakar
  { lat: 6.13, lng: 1.22, size: 1.0 }, // Lomé
  { lat: 6.37, lng: 2.43, size: 1.0 }, // Cotonou
];

const REGION = { lat: { min: 1, max: 22 }, lng: { min: -20, max: 7 } };

export function Routes() {
  return (
    <section className="section cv-auto relative overflow-hidden">
      <WireGrid />
      <GiantText outline className="-bottom-6 -right-[2%] text-[15vw]">
        RÉSEAU
      </GiantText>

      <div className="shell relative">
        <SectionTitle number="04" eyebrow="Nos liaisons" title={liaisons.title} />

        <div className="mt-16 grid items-center gap-12 md:mt-20 lg:grid-cols-2">
          {/* Dotted map of the West-Africa network (magicui · svg-dotted-map) */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 scale-110 bg-radial-gold" />
            <DottedMap
              width={150}
              height={118}
              markers={NETWORK}
              region={REGION}
              dotColor="#37506F"
              dotRadius={0.42}
              className="w-full"
            />
          </div>

          {/* Liaison list */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
          >
            {liaisons.routes.map((r) => (
              <motion.div
                key={`${r.from}-${r.to}`}
                variants={staggerItem}
                className="group flex items-center justify-between rounded-xl border border-line/70 bg-navy-light/30 px-5 py-3.5 transition-all duration-300 hover:border-gold/40 hover:bg-navy-light/60"
              >
                <div className="flex items-center gap-3 font-display text-sm font-medium text-ink">
                  <span>{r.from}</span>
                  <span className="h-px w-6 bg-gold/40 transition-all duration-300 group-hover:w-9" />
                  <span>{r.to}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <p className="mt-10 text-center text-sm italic text-muted">{liaisons.note}</p>
      </div>

      {/* Scroll-reactive velocity band (magicui) */}
      <div className="relative mt-16 overflow-hidden border-y border-line/50 bg-navy-deep/60 py-5">
        <ScrollVelocityContainer>
          <ScrollVelocityRow baseVelocity={4} direction={1}>
            {liaisons.routes.map((r, i) => (
              <span
                key={i}
                className="mx-5 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-muted"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {r.from} <span className="text-gold/70">→</span> {r.to}
              </span>
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>
    </section>
  );
}
