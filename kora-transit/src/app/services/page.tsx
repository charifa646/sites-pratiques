import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { Destinations } from "@/components/sections/Destinations";
import { FinalCta } from "@/components/sections/FinalCta";
import { headers, servicesDetail, images } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nos services",
  description: headers.services.subtitle,
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title={headers.services.title}
        subtitle={headers.services.subtitle}
        image={images.highway}
        bgWord="SERVICES"
      />
      <section className="section">
        <div className="shell flex flex-col gap-20 lg:gap-28">
          {servicesDetail.map((s, i) => (
            <ServiceDetail key={s.title} service={s} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>
      <Destinations />
      <FinalCta />
    </>
  );
}
