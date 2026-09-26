import type { Metadata } from "next";
import { PoseHome } from "@/components/pose/Home";
import { jsonLd } from "@/lib/seo";
import "./v2/v2.css";
import "@/components/pose/pose.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
      <PoseHome />
    </>
  );
}
