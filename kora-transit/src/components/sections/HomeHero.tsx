"use client";

import { useIsMobile } from "@/lib/useIsMobile";
import { BusExperience } from "@/components/sections/BusExperience";
import { MobileHero } from "@/components/sections/MobileHero";

/**
 * Mounts ONE hero based on viewport: the heavy scroll-pinned BusExperience on
 * desktop, the lighter scroll-expand MobileHero on mobile. Neutral first paint
 * avoids hydration mismatch and never mounts the heavy version on mobile.
 */
export function HomeHero() {
  const isMobile = useIsMobile();
  if (isMobile === null) {
    return <section className="min-h-[100svh] bg-navy-deep" aria-hidden />;
  }
  return isMobile ? <MobileHero /> : <BusExperience />;
}
