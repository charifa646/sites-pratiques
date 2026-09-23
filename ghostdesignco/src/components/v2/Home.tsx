"use client";

import dynamic from "next/dynamic";
import { Footer } from "@/components/ui/Footer";
import { V2Build } from "./Build";
import { V2Contact } from "./Contact";
import { Marquee } from "./Extras";
import { V2Faq } from "./Faq";
import { V2Header } from "./Header";
import { V2Hero } from "./Hero";
import { V2Method } from "./Method";
import { V2Pricing } from "./Pricing";
import { V2Services } from "./Services";
import { V2Voices } from "./Voices";
import { V2Work } from "./Work";

// the glass ghost, loaded after the page: the text never waits for it
const Companion = dynamic(() => import("./Companion"), { ssr: false });

/**
 * V2: the same agency, told calmly. A light page with a few strong moments
 * (the site that builds itself, the services walk-through, the method line)
 * and the glass ghost of the 3D site travelling down the page with you.
 */
export function V2Home() {
  return (
    <>
      <V2Header />
      <main>
        <V2Hero />
        <Marquee />
        <V2Build />
        <V2Services />
        <V2Work />
        <V2Voices />
        <V2Method />
        <V2Pricing />
        <V2Faq />
        <V2Contact />
      </main>
      <div className="bg-[#0B0B0C]" data-ghost-dark>
        <Footer />
      </div>
      <Companion />
    </>
  );
}
