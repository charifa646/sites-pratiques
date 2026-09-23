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

export const metadata: Metadata = {
  title: "MAKEDO | агентство системного продвижения брендов",
  description:
    "Объединяем аналитику, стратегию и креатив, превращая внимание аудитории в результат для бизнеса",
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
