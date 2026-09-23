import type { Metadata, Viewport } from "next";
import { Exo_2, Unbounded } from "next/font/google";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import "./globals.css";

const exo = Exo_2({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-exo",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-unbounded",
  display: "swap",
});

const title = "MAKEDO | агентство системного продвижения брендов";
const description =
  "Объединяем аналитику, стратегию и креатив, превращая внимание аудитории в результат для бизнеса";

// Absolute base for the Open Graph image: the Vercel production URL when built there.
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title,
  description,
  openGraph: { type: "website", locale: "ru_RU", siteName: "MAKEDO", title, description },
  twitter: { card: "summary_large_image", title, description },
  // Design-to-code reproduction of a mockup: keep it out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${exo.variable} ${unbounded.variable}`}>
      <body className="font-sans">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
