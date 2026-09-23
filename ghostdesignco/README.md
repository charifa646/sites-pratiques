# Ghostdesignco

Site de l'agence Ghostdesignco (création de sites web sur mesure). Une seule page, pensée comme une plongée : la page défile au premier plan pendant qu'une caméra traverse un monde 3D temps réel, guidée par un fantôme en verre dépoli. Objectif de la page : recevoir des demandes de devis.

## Lancer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## À compléter avant la mise en ligne

`src/lib/site.ts` : numéro WhatsApp (format international, chiffres seuls, ex. `33612345678`) et adresse e-mail qui reçoivent les briefs. Tant qu'ils sont vides, WhatsApp s'ouvre avec le message prêt et laisse choisir le destinataire, et la messagerie s'ouvre avec le champ « À » vide.

## Le parcours

| Étape (section) | Dans la scène 3D |
| --- | --- |
| Accueil | Le fantôme sort du sol miroir, encadré par une sélection façon Figma (nom du calque, poignées, dimensions en direct). Il suit le pointeur du regard. |
| En chiffres | Quinze maquettes de sites s'allument une à une en arche au-dessus des chiffres, puis s'alignent en tunnel que la caméra traverse. |
| Le constat | Un site en fil de fer se construit pendant le défilement : clarté, confiance, envie apparaissent au même moment que les mots. Le fantôme regarde par-dessus. |
| L'offre | Sites vitrines (trois pages en éventail), landing pages (téléphone qui défile jusqu'au bouton d'action), pages de vente (sections qui s'assemblent). |
| Contact | Un cadre de lumière épouse le formulaire (il suit sa position à l'écran) et se reflète dans le sol. |

Entre deux étapes, la caméra franchit un cadre Figma nommé comme la section suivante. Les boutons « Parlons de votre projet » et « Discutons de votre projet » déclenchent une plongée animée jusqu'au formulaire, en présélectionnant le besoin choisi.

Le formulaire compose un brief relisible et modifiable, puis l'envoie par WhatsApp ou par e-mail (aucun serveur, aucune donnée stockée).

## Technique

- Next.js 14 (App Router), React 18, TypeScript strict, Tailwind CSS 3, Framer Motion 11, Lenis
- three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing
- Un seul canvas fixe derrière la page, chargé à la demande. Les poses de caméra sont décrites par section dans `src/components/three/stations.ts` (une table paysage, une table portrait).
- Tout est généré en code : maquettes de sites dessinées sur canvas (`textures.ts`), fantôme modélisé par révolution (`Ghost.tsx`), sol miroir avec reflet temps réel (`Floor.tsx`). Aucun modèle ni image à télécharger.
- Deux niveaux de rendu : ordinateurs (verre à transmission, reflet du sol, bloom) et mobiles ou machines modestes (même scène, rendu allégé). La résolution baisse d'elle-même si les images par seconde chutent.
- `prefers-reduced-motion` : la caméra passe d'une étape à l'autre sans vol, animations figées. Sans WebGL 2, la page s'affiche sans la scène.
- `?world=hi` ou `?world=lo` dans l'URL force un niveau de rendu (tests).

## Crédits

- Clash Display (Indian Type Foundry, via Fontshare), ITF Free Font License
- DM Sans et Instrument Serif (Google Fonts), SIL Open Font License
