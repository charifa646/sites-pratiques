# MAKEDO : design to code

Intégration web des trois slides de la maquette MAKEDO (agence de promotion systémique de marques), avec les objets 3D rendus en temps réel.

## Lancer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Stack

- Next.js 14 (App Router), React 18, TypeScript strict
- Tailwind CSS 3, Framer Motion 11, Lenis (défilement fluide sur desktop)
- three.js + @react-three/fiber + @react-three/drei (scènes chargées à la demande)
- Polices : Unbounded (titres) et Exo 2 (texte), sous-ensembles cyrillique + latin

## Fidélité à la maquette

- Textes russes repris mot pour mot (`src/lib/copy.ts`), avec les retours à la ligne de la maquette sur desktop.
- Dès 1280 px, chaque slide est posée dans un repère de 1926 × 1092 px mesuré sur la maquette (`src/lib/stage.ts`) : les positions et tailles suivent la largeur de la scène (unités de conteneur). En dessous, la mise en page passe en flux responsive (mobile, tablette).
- Le logo MAKEDO est redessiné en SVG à partir des mesures de la maquette, avec l'écart de chaque lettre (`src/components/ui/Wordmark.tsx`).
- Couleurs relevées par échantillonnage de la maquette (`tailwind.config.ts`).

## 3D temps réel

| Slide | Objets | Animation |
| --- | --- | --- |
| 1 | Main laquée noire, papillon monarque (ailes peintes en code) | La main monte, le papillon se pose puis s'envole quand on fait défiler la page |
| 2 | Main tenant une fraise noire alvéolée, fraise en cristal orange | Le cadre de sélection façon Figma suit la fraise en temps réel |
| 3 | Pomme en cristal facetté, flèche en acier, piédestal | La flèche transperce la pomme à chaque entrée dans l'écran |

- Environnement studio procédural (aucune image HDR téléchargée), matériaux physiques (laque, cristal, chrome).
- Chaque canvas ne se monte qu'à l'approche de l'écran et ne calcule d'images que lorsqu'il est visible.
- `prefers-reduced-motion` est respecté (révélations et 3D figées dans leur état final).

## Crédits

Modèle de main : [WebXR Input Profiles](https://github.com/immersive-web/webxr-input-profiles), « generic-hand », licence MIT (Amazon). Voir `public/models/LICENSE-hand.md`. Il est reposé par cinématique directe dans `src/components/three/handRig.ts`.
