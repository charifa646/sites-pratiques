"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { offer } from "@/lib/copy";
import { dive } from "@/lib/scroll";
import { tour } from "@/lib/tour";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { SelectionFrame } from "@/components/ui/SelectionFrame";
import { Tour } from "@/components/ui/Tour";
import { Hero } from "@/components/sections/Hero";
import { V2Build } from "@/components/v2/Build";
import { V2Contact } from "@/components/v2/Contact";
import { V2Faq } from "@/components/v2/Faq";
import { Marquee } from "@/components/v2/Marquee";
import { V2Method } from "@/components/v2/Method";
import { V2Pricing } from "@/components/v2/Pricing";
import { V2Proof } from "@/components/v2/Proof";
import { V2Services, showOffer } from "@/components/v2/Services";
import { V2Voices } from "@/components/v2/Voices";
import { V2Work } from "@/components/v2/Work";
import { V2_STEPS, locateV2 } from "@/components/v2/tour";

const World = dynamic(() => import("@/components/three/World"), { ssr: false });
// the glass ghost of the page, loaded after it: the text never waits for it
const Companion = dynamic(() => import("@/components/v2/Companion"), { ssr: false });

/**
 * The posed version: the 3D site's hero as it is (glass ghost, mirror floor),
 * then no more camera travel. The sections of V2 follow, calm and on the dark
 * side (see pose.css), and the ghost leaves the hero to walk down the page.
 */
export function PoseHome() {
  const selection = useRef<HTMLDivElement>(null);

  // the guided tour walks this page's sections (those on the page)
  useEffect(() => {
    tour.configure(
      V2_STEPS.filter((s) => document.getElementById(s.id)),
      locateV2,
    );
    return () => tour.reset();
  }, []);

  // at each offer's stop of the tour, its tab opens (the tour does the scrolling)
  useEffect(
    () =>
      tour.subscribe((s) => {
        if (!s.active) return;
        const i = offer.items.findIndex((o) => o.anchor === tour.steps()[s.index]?.id);
        if (i >= 0) showOffer(i, false);
      }),
    [],
  );

  // links scroll at the calm pace of V2: no camera travel to wait for
  useEffect(() => {
    const was = dive.duration;
    dive.duration = 1.2;
    return () => {
      dive.duration = was;
    };
  }, []);

  // sections are numbered in page order
  const order = ["preuve", "constat", "services", "realisations", "temoignages", "methode", "tarifs", "questions", "contact"];
  const n = (id: string) => String(order.indexOf(id) + 1).padStart(2, "0");

  return (
    <div className="pose" data-ghost-dark>
      <World selectionRef={selection} mode="pose" />
      <SelectionFrame ref={selection} />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <V2Proof n={n("preuve")} />
        <V2Build n={n("constat")} />
        <V2Services n={n("services")} />
        <V2Work n={n("realisations")} />
        <V2Voices n={n("temoignages")} />
        <V2Method n={n("methode")} />
        <V2Pricing n={n("tarifs")} />
        <V2Faq n={n("questions")} />
        <V2Contact n={n("contact")} />
      </main>
      {/* flat under the footer: the world has stopped drawing down here */}
      <div className="relative z-10 bg-[#0B0B0C]">
        <Footer />
      </div>
      <Companion />
      <Tour />
      <div aria-hidden className="veil pointer-events-none fixed inset-0 z-[70] bg-void" />
    </div>
  );
}
