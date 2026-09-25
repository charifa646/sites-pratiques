import type { Metadata } from "next";
import { Experience } from "@/components/Experience";
import { jsonLd } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
      <Experience />
    </>
  );
}
