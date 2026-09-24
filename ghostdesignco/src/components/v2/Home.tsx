"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { tour } from "@/lib/tour";
import { Tour } from "@/components/ui/Tour";
import { Footer } from "@/components/ui/Footer";
import { V2Build } from "./Build";
import { V2Contact } from "./Contact";
import { V2Faq } from "./Faq";
import { V2Header } from "./Header";
import { V2Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { V2Method } from "./Method";
import { V2Pricing } from "./Pricing";
import { V2Services } from "./Services";
import { V2Voices } from "./Voices";
import { V2Work, realProjects } from "./Work";
import { V2_STEPS, locateV2 } from "./tour";

// the glass ghost, loaded after the page: the text never waits for it
const Companion = dynamic(() => import("./Companion"), { ssr: false });

/**
 * V2: the same agency, told calmly. A light page with a few strong moments
 * (the site that builds itself, the services walk-through, the method line)
 * and the glass ghost of the 3D site travelling down the page with you.
 */
export function V2Home() {
  // the guided tour walks this page's sections (those on the page)
  useEffect(() => {
    tour.configure(
      V2_STEPS.filter((s) => document.getElementById(s.id)),
      locateV2,
    );
    return () => tour.reset();
  }, []);

  // sections are numbered in page order; réalisations only once there are captures
  const order = ["constat", "services", ...(realProjects.length ? ["realisations"] : []), "temoignages", "methode", "tarifs", "questions", "contact"];
  const n = (id: string) => String(order.indexOf(id) + 1).padStart(2, "0");

  return (
    <>
      <V2Header />
      <main>
        <V2Hero />
        <Marquee />
        <V2Build n={n("constat")} />
        <V2Services n={n("services")} />
        <V2Work n={n("realisations")} />
        <V2Voices n={n("temoignages")} />
        <V2Method n={n("methode")} />
        <V2Pricing n={n("tarifs")} />
        <V2Faq n={n("questions")} />
        <V2Contact n={n("contact")} />
      </main>
      <div className="bg-[#0B0B0C]" data-ghost-dark>
        <Footer />
      </div>
      <Companion />
      <Tour />
    </>
  );
}
