import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { WhyUs } from "@/components/sections/WhyUs";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { Routes } from "@/components/sections/Routes";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <WhyUs />
      <ServicesPreview />
      <Routes />
      <Testimonials />
      <FinalCta />
    </>
  );
}
