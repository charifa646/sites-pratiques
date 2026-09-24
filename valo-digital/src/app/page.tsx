import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Pillars } from "@/components/Pillars";
import { Formations } from "@/components/Formations";
import { Services } from "@/components/Services";
import { Conseil } from "@/components/Conseil";
import { Methode } from "@/components/Methode";
import { Closing } from "@/components/Closing";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-[var(--header)]">
        <Hero />
        <Problem />
        <Pillars />
        <Formations />
        <Services />
        <Conseil />
        <Methode />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
