import { BusExperience } from "@/components/sections/BusExperience";
import { Stats } from "@/components/sections/Stats";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { Routes } from "@/components/sections/Routes";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <BusExperience />
      <Stats />
      <ServicesPreview />
      <Routes />
      <Testimonials />
      <FinalCta />
    </>
  );
}
