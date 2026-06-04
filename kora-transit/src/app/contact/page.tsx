import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ContactSection } from "@/components/sections/ContactSection";
import { headers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: headers.contact.subtitle,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title={headers.contact.title}
        subtitle={headers.contact.subtitle}
      />
      <ContactSection />
    </>
  );
}
