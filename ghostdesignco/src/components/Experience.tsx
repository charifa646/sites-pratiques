"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { SelectionFrame } from "@/components/ui/SelectionFrame";
import { Tour } from "@/components/ui/Tour";
import { Hero } from "@/components/sections/Hero";
import { Proof } from "@/components/sections/Proof";
import { Problem } from "@/components/sections/Problem";
import { Offer } from "@/components/sections/Offer";
import { Work } from "@/components/sections/Work";
import { Voices } from "@/components/sections/Voices";
import { Method } from "@/components/sections/Method";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import type { PaletteName } from "@/components/three/palette";

const World = dynamic(() => import("@/components/three/World"), { ssr: false });

/**
 * One continuous dive: a fixed WebGL world behind the page, the camera
 * travelling through it as the sections scroll by. The palette colours the
 * world ("warm" for the /nuit-chaude preview; the page takes it from CSS).
 */
export function Experience({ palette = "night" }: { palette?: PaletteName }) {
  const selection = useRef<HTMLDivElement>(null);
  return (
    <>
      <World selectionRef={selection} palette={palette} />
      <SelectionFrame ref={selection} />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Proof />
        <Problem />
        <Offer />
        <Work />
        <Voices />
        <Method />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Tour />
      <div aria-hidden className="veil pointer-events-none fixed inset-0 z-[70] bg-void" />
    </>
  );
}
