import { HomeHero } from "@/components/sections/HomeHero";
import { Stats } from "@/components/sections/Stats";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { Routes } from "@/components/sections/Routes";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Stats />
      <ServicesPreview />
      <Routes />
      <Testimonials />
      <FinalCta />
    </>
  );
}
