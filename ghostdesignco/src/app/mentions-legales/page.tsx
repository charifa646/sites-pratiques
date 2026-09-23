import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/ui/Footer";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Mentions légales & confidentialité | Ghostdesignco",
  description: "Éditeur, hébergement, propriété intellectuelle et données personnelles du site Ghostdesignco.",
};

// TODO(client): complete the publisher block (identity, status, SIRET, address, contact).
const pending = "à compléter";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/10 py-10">
      <h2 className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold tracking-[-0.02em] text-bone">{title}</h2>
      <div className="mt-5 space-y-3 text-[16px] leading-relaxed text-fog">{children}</div>
    </section>
  );
}

export default function Legal() {
  return (
    <>
      <header className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-6 sm:px-10">
        <Link href="/" className="text-[17px]" aria-label="Ghostdesignco, retour au site">
          <Logo />
        </Link>
        <Link href="/" className="text-[14px] text-fog transition-colors hover:text-bone">
          ← Retour au site
        </Link>
      </header>
      <main className="mx-auto max-w-[860px] px-5 pb-24 pt-10 sm:px-10">
        <h1 className="font-display text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-bone">
          Mentions légales <span className="font-serif font-normal italic text-acid">& confidentialité</span>
        </h1>

        <Block title="Éditeur du site">
          <p>Nom ou raison sociale : {pending}</p>
          <p>Statut juridique et numéro SIRET : {pending}</p>
          <p>Adresse : {pending}</p>
          <p>Contact : contactcharifa99@gmail.com · WhatsApp +226 68 74 61 26</p>
          <p>Directeur ou directrice de la publication : {pending}</p>
        </Block>

        <Block title="Hébergement">
          <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Site : vercel.com</p>
        </Block>

        <Block title="Propriété intellectuelle">
          <p>
            L&apos;ensemble des contenus de ce site (textes, visuels, animations, code) est la propriété de Ghostdesignco, sauf mention
            contraire. Toute reproduction sans autorisation préalable est interdite.
          </p>
        </Block>

        <Block title="Données personnelles">
          <p>
            Le formulaire de contact n&apos;enregistre aucune donnée sur un serveur : votre message est préparé dans votre navigateur,
            puis vous l&apos;envoyez vous-même par WhatsApp ou par e-mail.
          </p>
          <p>
            Les informations que vous nous transmettez servent uniquement à répondre à votre demande et à préparer votre devis. Vous
            pouvez demander à tout moment leur consultation, leur rectification ou leur suppression en nous écrivant.
          </p>
        </Block>

        <Block title="Cookies">
          <p>Ce site n&apos;utilise aucun cookie publicitaire ni de mesure d&apos;audience.</p>
          <p>
            Les témoignages vidéo sont hébergés par des plateformes tierces. Ils ne se chargent que lorsque vous appuyez sur lecture ;
            la plateforme concernée peut alors déposer ses propres cookies, selon sa politique de confidentialité.
          </p>
        </Block>
      </main>
      <Footer home={false} />
    </>
  );
}
