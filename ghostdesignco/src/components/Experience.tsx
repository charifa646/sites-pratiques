"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { Header } from "@/components/ui/Header";
import { SelectionFrame } from "@/components/ui/SelectionFrame";
import { Hero } from "@/components/sections/Hero";
import { Proof } from "@/components/sections/Proof";
import { Problem } from "@/components/sections/Problem";
import { Offer } from "@/components/sections/Offer";
import { Contact } from "@/components/sections/Contact";

const World = dynamic(() => import("@/components/three/World"), { ssr: false });

/**
 * One continuous dive: a fixed WebGL world behind the page, the camera
 * travelling through it as the sections scroll by.
 */
export function Experience() {
  const selection = useRef<HTMLDivElement>(null);
  return (
    <>
      <World selectionRef={selection} />
      <SelectionFrame ref={selection} />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Proof />
        <Problem />
        <Offer />
        <Contact />
      </main>
      <div aria-hidden className="veil pointer-events-none fixed inset-0 z-[70] bg-void" />
    </>
  );
}
