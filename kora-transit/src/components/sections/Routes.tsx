"use client";

import { SectionTitle } from "@/components/ui/SectionTitle";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { LiaisonsMap } from "@/components/sections/LiaisonsMap";
import { liaisons, images } from "@/lib/data";

export function Routes() {
  return (
    <section className="section relative overflow-hidden">
      <AuroraBackground image={images.scene.lightTrailsAlt} imageOpacity={0.12} />
      <div className="shell relative">
        <SectionTitle number="03" title={liaisons.title} />

        <div className="mt-14">
          <LiaisonsMap />
        </div>

        <p className="mt-8 text-center text-sm italic text-muted">{liaisons.note}</p>
      </div>

      {/* Scrolling marquee band */}
      <div className="relative mt-16 overflow-hidden border-y border-line/50 bg-navy-deep/60 py-5">
        <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap pr-10">
          {[...liaisons.routes, ...liaisons.routes].map((r, i) => (
            <span
              key={i}
              className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {r.from} <span className="text-gold/70">—</span> {r.to}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
