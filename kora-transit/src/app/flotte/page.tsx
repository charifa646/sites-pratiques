import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { FleetClasses } from "@/components/sections/FleetClasses";
import { FinalCta } from "@/components/sections/FinalCta";
import { headers, images } from "@/lib/data";

export const metadata: Metadata = {
  title: "Notre flotte",
  description: headers.flotte.subtitle,
};

export default function FlottePage() {
  return (
    <>
      <PageHeader
        title={headers.flotte.title}
        subtitle={headers.flotte.subtitle}
        text={headers.flotte.text}
        image={images.pageHero.flotte}
        bgWord="FLOTTE"
      />
      <FleetClasses />
      <FinalCta />
    </>
  );
}
