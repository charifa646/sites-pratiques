# CLAUDE.md — Règles de travail · KORA TRANSIT

> ⚠️ Ce fichier contient des clés privées — NE PAS pusher sur GitHub public. Ajouter CLAUDE.md au .gitignore.

---

## ✅ CONFIGURATION INITIALE OBLIGATOIRE (à faire AVANT tout code)

### 1. Installer les skills de design
Installe ces deux skills depuis GitHub avant de commencer :
- https://github.com/Leonxlnx/taste-skill
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

### 2. Installer le MCP 21st.dev (composants motion premium)
```bash
claude mcp add magic --scope user --env API_KEY="c91c939169646ee516c2f37eacb42e309a2905a4d784804802730003f0ebefa1" -- npx -y @21st-dev/magic@latest
```
Ce MCP te donne accès à des composants motion design premium. Utilise-le pour tous les éléments d'animation sophistiqués.

### 3. Confirmer que tout est installé avant d'écrire la moindre ligne de code.

---

## Identité du projet
- **Nom** : KORA TRANSIT
- **Activité** : Compagnie de transport premium inter-urbain (Afrique de l'Ouest)
- **Services** : Transport de voyageurs · Livraison de marchandises
- **Ton** : Premium, fiable, moderne. Jamais familier. Zéro emoji dans le contenu.
- **Cible** : Voyageurs et entreprises cherchant un transport sûr, confortable et ponctuel
- **Type de site** : Vitrine multipage — aucun backend

---

## Palette de couleurs (NE JAMAIS DÉVIER)
| Rôle | Couleur | Hex |
|---|---|---|
| Fond principal | Navy profond | `#0B1628` |
| Surface carte | Navy clair | `#111F35` |
| Bordure subtile | — | `#1E2E45` |
| Accent principal | Or chaud | `#C9A84C` |
| Texte principal | Blanc cassé | `#F5F5F0` |
| Texte secondaire | Gris bleuté | `#A0A8B8` |

---

## Typographie
- **Titres** : Poppins Bold (Google Fonts)
- **Corps** : Inter Regular (Google Fonts)
- **H1** : 64px desktop / 36px mobile
- **H2** : 42px desktop / 28px mobile
- **Corps** : 16px, line-height 1.6

---

## Stack technique
- Next.js 14 (App Router uniquement — jamais Pages Router)
- TypeScript strict
- Tailwind CSS v3
- Framer Motion 11

---

## Animations & Motion Design (PRIORITÉ HAUTE)
Ce site doit avoir un rendu motion design sophistiqué et premium. Utilise le MCP 21st.dev pour les composants animés.

### Effets requis :
- **Hero** : vidéo en arrière-plan (HTML5 `<video>`, autoplay, muted, loop) + overlay navy semi-transparent + texte animé à l'entrée
- **Backgrounds animés** : particules ou gradient en mouvement sur certaines sections (utilise le MCP ou CSS animations)
- **Cartes de localisation animées** : cartes de trajet avec animation de route/connexion entre villes
- **Scroll animations** : chaque section s'anime à l'entrée (Framer Motion whileInView)
- **Hover effects** : cartes de services avec micro-animations premium
- **Transitions de pages** : transitions fluides entre les routes Next.js
- **Compteurs animés** : chiffres clés qui s'incrémentent au scroll (ex: 50k+ voyageurs)

### Règles d'animation :
- Utiliser `useInView` et `whileInView` de Framer Motion pour le scroll
- Durées : 0.4s à 0.8s — jamais plus de 1s
- Easing : `easeOut` ou `[0.25, 0.46, 0.45, 0.94]`
- Stagger entre éléments : 0.1s à 0.15s

---

## Architecture des dossiers
```
src/
├── app/
│   ├── page.tsx              (Accueil)
│   ├── services/page.tsx
│   ├── flotte/page.tsx
│   ├── reservation/page.tsx
│   ├── a-propos/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   └── ui/
└── lib/
```

---

## Images
- Source exclusive : **Unsplash** (libres de droits, URLs directes)
- Utilise `next/image` avec width/height définis
- Termes de recherche par section : voir **ASSETS.md**

---

## Formulaire de réservation
- Formulaire **statique** uniquement — zéro backend
- Soumission via **Formspree**
- Champs : Nom · Téléphone · Ville départ · Ville arrivée · Date · Nbre passagers · Message (optionnel)
- Validation HTML5 + feedback visuel succès/erreur

---

## Ce que tu NE dois PAS faire
- Dévier de la palette de couleurs
- Utiliser des emojis dans le contenu visible
- Inventer du texte (tout vient de COPYWRITING.md)
- Faire du backend, API routes ou base de données
- Ajouter des fonctionnalités non demandées
- Utiliser le Pages Router

---

## Références
- Textes → **COPYWRITING.md**
- Visuels & inspiration → **ASSETS.md**
- Structure des pages → **COMPONENTS.md**
