"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
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
import { V2Services, showOffer } from "@/components/v2/Services";
import { V2Voices } from "@/components/v2/Voices";
import { heroGhost } from "@/components/v2/handoff";
import { HERO_READY } from "@/components/v2/quality";
import { V2_STEPS, locateV2 } from "@/components/v2/tour";
import { PoseIncluded } from "./Included";
import { PoseProof } from "./Proof";
import { PoseWork } from "./Work";

// the guide walks this page's sections, and sweeps through the pile of projects
const STEPS = V2_STEPS.map((s) => (s.id === "realisations" ? { ...s, sweep: 8 } : s));

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
  const [companion, setCompanion] = useState(false);

  // The companion only works below the hero. It loads once the ghost has
  // finished rising from the floor (compiling its glass then would stall that
  // entrance), or at the first scroll, whichever comes first.
  useEffect(() => {
    let wait = 0;
    const go = () => setCompanion(true);
    const afterEntrance = () => {
      wait = window.setTimeout(go, 2600);
    };
    if (heroGhost.ready) afterEntrance();
    else window.addEventListener(HERO_READY, afterEntrance, { once: true });
    window.addEventListener("scroll", go, { once: true, passive: true });
    // no 3D hero (no WebGL 2, reduced motion): no entrance to wait for
    const fallback = window.setTimeout(go, 9000);
    return () => {
      window.removeEventListener(HERO_READY, afterEntrance);
      window.removeEventListener("scroll", go);
      window.clearTimeout(wait);
      window.clearTimeout(fallback);
    };
  }, []);

  // the guided tour walks this page's sections (those on the page)
  useEffect(() => {
    tour.configure(
      STEPS.filter((s) => document.getElementById(s.id)),
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
  const order = ["preuve", "constat", "services", "compris", "realisations", "temoignages", "methode", "tarifs", "questions", "contact"];
  const n = (id: string) => String(order.indexOf(id) + 1).padStart(2, "0");

  return (
    <div className="pose" data-ghost-dark>
      <World selectionRef={selection} mode="pose" />
      <SelectionFrame ref={selection} />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <PoseProof n={n("preuve")} />
        <V2Build n={n("constat")} />
        <V2Services n={n("services")} />
        <PoseIncluded n={n("compris")} />
        <PoseWork n={n("realisations")} />
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
      {companion && <Companion />}
      <Tour />
      <div aria-hidden className="veil pointer-events-none fixed inset-0 z-[70] bg-void" />
    </div>
  );
}
