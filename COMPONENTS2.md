# COMPONENTS.md — Architecture des pages · KORA TRANSIT

> Construire chaque page dans l'ordre des sections ci-dessous.
> Textes → COPYWRITING.md · Visuels → ASSETS.md · Règles → CLAUDE.md

---

## COMPOSANTS GLOBAUX (présents sur toutes les pages)

### Navbar (`components/layout/Navbar.tsx`)
- Sticky en haut
- Transparente sur le hero, devient navy semi-opaque au scroll (backdrop-blur)
- Logo "KORA TRANSIT" à gauche (texte stylé, accent or sur "KORA")
- Liens : Accueil · Services · Notre Flotte · Réservation · À propos · Contact
- CTA or à droite : "Réserver"
- Menu burger animé en mobile (slide-in plein écran)

### Footer (`components/layout/Footer.tsx`)
- Fond navy plus profond
- Colonne 1 : logo + tagline "Le voyage repensé." + réseaux sociaux
- Colonne 2 : liens de navigation
- Colonne 3 : coordonnées (téléphone, email, siège)
- Bas : mentions "© 2024 KORA TRANSIT. Tous droits réservés."

---

## PAGE ACCUEIL (`app/page.tsx`)

**1. Hero** (`sections/Hero.tsx`)
- Pleine hauteur (100vh)
- Vidéo en arrière-plan (route de nuit / autocar) + overlay navy 50%
- Halo or diffus
- Titre surdimensionné : "Le transport qui ne vous fait jamais attendre."
- Sous-titre + 2 CTA ("Réserver mon trajet" / "Découvrir nos services")
- Animation : titre en fade-up au chargement, stagger sur les éléments

**2. Stats** (`sections/Stats.tsx`)
- Bande de 4 compteurs animés (incrément au scroll) : 500 000+ · 15 · 12 ans · 98%
- Chiffres énormes en or, labels en gris dessous

**3. Pourquoi KORA** (`sections/WhyUs.tsx`)
- Titre de section + sous-titre
- 4 cartes (Ponctualité · Confort · Sécurité · Service 24/24)
- Chaque carte : icône or + titre + description
- Animation : apparition en stagger au scroll

**4. Aperçu Services** (`sections/ServicesPreview.tsx`)
- Layout BENTO asymétrique (cartes de tailles variées)
- 3 services (Voyageurs / Fret / VIP) en glassmorphism
- Micro-animation au hover (élévation + glow or)
- CTA : "Voir tous nos services"

**5. Trajets / Liaisons** (`sections/Routes.tsx`)
- Cartes animées de trajets (ville départ → ville arrivée)
- Ligne/tracé animé entre les deux villes au scroll
- 4-6 liaisons phares affichées

**6. Témoignages** (`sections/Testimonials.tsx`)
- 3 témoignages en cartes
- Citation + nom + fonction
- Carrousel ou grille selon le rendu

**7. CTA Final** (`sections/FinalCta.tsx`)
- Bandeau pleine largeur, fond navy + halo or
- Titre "Votre prochain trajet mérite mieux." + CTA "Réserver maintenant"

---

## PAGE SERVICES (`app/services/page.tsx`)

**1. En-tête de page** (`sections/PageHeader.tsx` réutilisable)
- Titre "Nos services" + sous-titre, sur fond navy avec halo

**2. Service détaillé × 3** (`sections/ServiceDetail.tsx`)
- Alterner image gauche/droite pour chaque service
- Image + titre + description + liste de points clés (avec puces or)
- Service 1 (Voyageurs) · Service 2 (Fret) · Service 3 (VIP)

**3. Destinations** (`sections/Destinations.tsx`)
- Grille des liaisons desservies
- Style cartes ou liste élégante avec flèches or

**4. CTA** (réutiliser `FinalCta`)

---

## PAGE FLOTTE (`app/flotte/page.tsx`)

**1. En-tête** (PageHeader)
- "Notre flotte" + sous-titre + texte sur le contrôle 47 points

**2. Les 3 classes** (`sections/FleetClasses.tsx`)
- 3 cartes premium : KORA STANDARD · KORA BUSINESS · KORA PREMIUM
- Chaque carte : image véhicule + nom + description + capacité + liste équipements
- La classe PREMIUM mise en avant : bordure or + badge "Le plus exclusif"
- Animation : cartes en fade-up stagger

**3. CTA** (FinalCta)

---

## PAGE RÉSERVATION (`app/reservation/page.tsx`)

**1. En-tête** (PageHeader)
- "Réservez votre trajet" + sous-titre

**2. Formulaire** (`sections/BookingForm.tsx`)
- Formulaire Formspree (action POST vers endpoint — laisser un placeholder `FORMSPREE_ENDPOINT`)
- Champs : Nom · Téléphone · Ville départ · Ville arrivée · Date · Nbre passagers · Classe (select) · Message
- Validation HTML5 + états succès/erreur stylés
- Disposition épurée, inputs en surface navy clair avec focus or
- À côté du form : encart rassurance (confidentialité + délai de réponse 30 min)

---

## PAGE À PROPOS (`app/a-propos/page.tsx`)

**1. En-tête** (PageHeader)
- "À propos de KORA TRANSIT" + sous-titre

**2. Notre histoire** (`sections/Story.tsx`)
- Texte narratif (2 paragraphes) + image (terminal / route Afrique de l'Ouest)
- Mise en page éditoriale

**3. Mission & Vision** (`sections/MissionVision.tsx`)
- 2 blocs côte à côte

**4. Valeurs** (`sections/Values.tsx`)
- 4 valeurs (Fiabilité · Sécurité · Excellence · Respect) en cartes avec icônes or

**5. Équipe** (`sections/Team.tsx`)
- 4 membres : photo (placeholder Unsplash portrait) + nom + fonction
- Cartes premium au hover

**6. Chiffres** (réutiliser `Stats` avec les 5 chiffres À propos)

**7. CTA** (FinalCta)

---

## PAGE CONTACT (`app/contact/page.tsx`)

**1. En-tête** (PageHeader)
- "Contactez-nous" + sous-titre

**2. Contact** (`sections/ContactSection.tsx`)
- Colonne gauche : coordonnées (siège, agence, téléphone, email, horaires) avec icônes or
- Colonne droite : formulaire de contact (Formspree) — Nom · Email · Téléphone · Sujet · Message
- Validation + états succès/erreur

---

## ORDRE DE CONSTRUCTION RECOMMANDÉ
1. Layout (Navbar + Footer) + globals.css (palette + fonts)
2. Composants UI réutilisables (Button, Card, SectionTitle, AnimatedCounter)
3. PageHeader + FinalCta (réutilisables)
4. Page Accueil (toutes ses sections)
5. Services → Flotte → Réservation → À propos → Contact
6. Responsive pass complet
7. Vérification animations + performance

---

## COMPOSANTS UI À CRÉER (`components/ui/`)
- `Button.tsx` (variantes : primaire or, secondaire outline)
- `Card.tsx` (glassmorphism navy)
- `SectionTitle.tsx` (avec numéro de section optionnel en or)
- `AnimatedCounter.tsx` (compteur incrémental au scroll)
- `RevealOnScroll.tsx` (wrapper Framer Motion whileInView)
