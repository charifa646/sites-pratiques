import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Pillars } from "@/components/Pillars";
import { Intro } from "@/components/Intro";
import { Orientation } from "@/components/Orientation";
import { Formations } from "@/components/Formations";
import { Prestations } from "@/components/Prestations";
import { Social } from "@/components/Social";
import { Solutions } from "@/components/Solutions";
import { Methode } from "@/components/Methode";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SelectionProvider } from "@/components/selection/Selection";

export default function Home() {
  return (
    <SelectionProvider>
      <Header />
      <main className="pt-[var(--header)]">
        <Hero />
        <Pillars />
        <Intro />
        <Orientation />
        <Formations />
        <Prestations />
        <Social />
        <Solutions />
        <Methode />
        <Contact />
      </main>
      <Footer />
    </SelectionProvider>
  );
}
