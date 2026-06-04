"use client";

import { SectionTitle } from "@/components/ui/SectionTitle";
import { GiantText } from "@/components/ui/GiantText";
import { WireGrid } from "@/components/ui/WireGrid";
import { LiaisonsMap } from "@/components/sections/LiaisonsMap";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/ScrollVelocity";
import { liaisons } from "@/lib/data";

export function Routes() {
  return (
    <section className="section relative overflow-hidden">
      <WireGrid />
      <GiantText outline className="-bottom-6 -right-[2%] text-[15vw]">
        RÉSEAU
      </GiantText>

      <div className="shell relative">
        <SectionTitle number="04" eyebrow="Nos liaisons" title={liaisons.title} />

        <div className="mt-14">
          <LiaisonsMap />
        </div>

        <p className="mt-8 text-center text-sm italic text-muted">{liaisons.note}</p>
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
                {r.from} <span className="text-gold/70">—</span> {r.to}
              </span>
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>
    </section>
  );
}
