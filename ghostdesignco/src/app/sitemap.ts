import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/** The pages worth finding in a search; the drafts (/v2, /nuit-chaude) stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
