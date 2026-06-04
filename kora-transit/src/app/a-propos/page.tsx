import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Story } from "@/components/sections/Story";
import { MissionVision } from "@/components/sections/MissionVision";
import { Values } from "@/components/sections/Values";
import { Team } from "@/components/sections/Team";
import { Stats } from "@/components/sections/Stats";
import { FinalCta } from "@/components/sections/FinalCta";
import { headers, statsAbout, images } from "@/lib/data";

export const metadata: Metadata = {
  title: "À propos",
  description: headers.apropos.subtitle,
};

export default function AProposPage() {
  return (
    <>
      <PageHeader
        title={headers.apropos.title}
        subtitle={headers.apropos.subtitle}
        image={images.about.story}
        bgWord="KORA"
      />
      <Story />
      <MissionVision />
      <Values />
      <Team />
      <Stats stats={statsAbout} />
      <FinalCta />
    </>
  );
}
