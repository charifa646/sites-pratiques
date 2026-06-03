# Kora Transit

Premier projet de l'espace de travail **sites-pratiques**. Structure de base
prête à travailler — aucune page métier n'est encore codée.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS v3**
- **Framer Motion 11**
- **ESLint** (`eslint-config-next`)

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts

| Commande        | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Serveur de développement             |
| `npm run build` | Build de production                  |
| `npm run start` | Démarrage du build de production     |
| `npm run lint`  | Analyse ESLint                       |

## Structure

```
kora-transit/
├── src/
│   ├── app/          # App Router (layout, page, styles globaux)
│   ├── components/   # Composants réutilisables
│   └── lib/          # Utilitaires, helpers
├── public/
├── tailwind.config.ts
├── next.config.mjs
└── tsconfig.json
```
