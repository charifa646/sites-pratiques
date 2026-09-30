# Mémoire de Charifa (Ghostdesignco)

Claude Code lit ce fichier au début de chaque conversation sur ce dépôt. Il résume mon agence, mon stack de création de design et ma façon de travailler.

## Mon agence

- Ghostdesignco crée des sites web sur mesure pour les entrepreneurs et les entreprises francophones : sites vitrines, landing pages, pages de vente.
- Site : https://www.ghostdesignco.com (code dans `ghostdesignco/`).
- Chaque site a un but : faire demander un devis, sur WhatsApp ou par e-mail.

## Travailler avec moi

- Réponds en français et tutoie-moi. Sur les sites, les textes vouvoient le visiteur.
- Avant un changement important, dis-moi ce que tu vas faire et attends mon accord, sauf si je te donne carte blanche.
- Montre-moi des captures ordinateur et téléphone avant toute mise en ligne.
- Ne mets rien en ligne sans que je dise « publie » ou « pousse ». Ici, la production est la branche `claude/zealous-euler-Nyz19` : y pousser met www.ghostdesignco.com à jour.

## Mon stack de création de design

### Méthode

1. Inspiration : je t'envoie des captures ou des sites de référence. Analyse-les en détail avant d'écrire du code : enchaînement des sections, composition, effets de lumière et de profondeur, typographie, grilles.
2. Cadrage : mes textes, la direction visuelle et, s'il faut choisir des polices, une planche de comparaison.
3. Construction section par section, avec ma validation à chaque étape.
4. Audit final : textes intacts, affichage sur tous les écrans, vitesse sur téléphone, règles des skills de design.
5. Captures, puis mise en ligne quand je dis « publie ».

### Code

- Next.js 14 (App Router), React 18, TypeScript.
- Tailwind CSS 3.
- Framer Motion 11 : animations en ressort (stiffness 100, damping 20), composants animés en `'use client'`.
- Lenis pour le défilement fluide.
- Three.js avec React Three Fiber, Drei et Postprocessing, seulement si la 3D apporte vraiment quelque chose, avec une version allégée pour les appareils faibles.
- Écrans : téléphone sous 768 px, tablette de 768 à 1024 px, ordinateur au-dessus de 1024 px.

### Composants animés

- Bibliothèques : Magic UI, 21st.dev, shadcn/ui, Aceternity UI, Animata, Cult UI, Motion Primitives.
- Pour chaque animation : trouve le composant le plus proche, adapte-le à la palette et propose-le-moi avant de l'intégrer.
- Magic UI s'installe avec `pnpm dlx @magicuidesign/cli@latest install claude`. 21st.dev demande une clé API personnelle, qui ne va jamais dans le dépôt.

### Skills

- Design : taste-skill et ui-ux-pro-max. S'ils manquent, ils sont dans `.claude/skills/` sur la branche `claude/eager-bohr-wqm4l`.
- Textes : humanizer, pour enlever les tics d'écriture IA.
- Images et vidéos : les skills Higgsfield, dans `.claude/skills/`.

### Visuels, vidéo et son

- Higgsfield : images, maquettes, vidéos, acteur IA. Vérifie le coût en crédits avant de lancer.
- Unsplash : vraies photos pour les fonds et les décors.
- Pubs animées : codées en Next.js, rendues image par image avec Playwright et ffmpeg, avec musique et bruitages composés en Python.

### Typographie et couleurs

- Mes sites : Clash Display pour les titres. Ghostdesignco ajoute DM Sans pour le texte et Instrument Serif pour les mots en italique. Kora Transit utilise Inter.
- Une seule couleur signature, utilisée avec mesure. Ghostdesignco : vert acide `#B6FF3B` sur fond presque noir.
- Pour un client, sa charte graphique passe avant.

### Mise en ligne et suivi

- GitHub, puis Vercel qui déploie automatiquement.
- Domaine acheté chez Hostinger, serveurs de noms réglés sur Vercel.
- Vercel Analytics et Google Search Console.
- Formulaires : WhatsApp, et e-mail via FormSubmit. Vidéos de témoignages : Wistia.

## Mes règles de design

- Mes textes mot pour mot : pas de paraphrase, rien de raccourci. S'il manque un texte, demande-le.
- Aucun contenu inventé : ni chiffres, ni témoignages, ni promesses.
- Pas de loader, d'écran de chargement ni de barre de chargement.
- Pas d'emojis dans l'interface.
- Pas de tirets dans les textes des sites : ça fait IA.
- Rien qui fasse « site IA » : pas les mêmes cartes, pastilles et intitulés répétés d'une section à l'autre.
- Impressionnant mais léger : le site doit rester fluide, surtout sur téléphone.
- De vraies images plutôt que des illustrations génériques.
- Aucune clé ni aucun mot de passe dans le dépôt : il est public.

## Ce que j'aime

- Une expérience immersive dès l'arrivée, sans lourdeur, comme la V1 de Ghostdesignco.
- Les en-têtes spectaculaires façon Makedo : grille de cartes et texte centré.
- L'effet miroir.
- Les vagues en bas de section.
- Les grands textes en arrière-plan, dosés, adoucis et fondus dans le décor.

## Les projets du dépôt

- `ghostdesignco/` : le site de l'agence. Les anciennes versions restent accessibles : `/v1`, `/v2`, `/nuit-chaude`.
- `makedo/` : intégration de la maquette Makedo, ma référence pour les en-têtes.
- `valo-digital/` : site test pour le client VALO DIGITAL, en pause.
- `kora-transit/` : premier projet, avec son propre projet Vercel.
