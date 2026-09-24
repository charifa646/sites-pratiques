# VALO DIGITAL

Site test pour VALO DIGITAL, agence de croissance digitale basée à Ouagadougou,
construit à partir du catalogue « Catalogue des formations et solutions de
croissance » et de la couverture 2026.

- **Contenu** : uniquement celui du catalogue (formations, prestations, offres,
  solutions, méthode, contact), accents restaurés. Rien n'est inventé : pas de
  chiffres, de témoignages ou de références clients.
- **Identité** : couleurs, typographie et motifs de la couverture 2026 :
  - bleu électrique, jaune et navy ;
  - Montserrat ;
  - barre jaune, drapeau, carrés arrondis et icônes en cercles pointillés.
- **Logo** : le monogramme VD est redessiné en vectoriel d'après la couverture.
  Il est à remplacer par le fichier officiel dès que le client le fournit
  (`src/components/brand/Logo.tsx`).
- **Ma sélection** : le visiteur ajoute des formations ou des offres, puis
  envoie la liste par WhatsApp ou par e-mail. La sélection reste dans son
  navigateur.
- **Indexation** : le site est en `noindex` tant qu'il reste un site test
  (`src/app/layout.tsx`).

## Démarrer

```bash
cd valo-digital
npm install
npm run dev
```

Pour le déploiement sur Vercel, créer un projet avec `valo-digital` comme
dossier racine (Root Directory).

## Photos

Les photos sont des photos d'illustration de la licence Unsplash, gratuites
pour un usage commercial. Elles ne représentent ni l'équipe ni des clients de
VALO DIGITAL.

| Fichier                             | Photographe     | Source                                    |
| ----------------------------------- | --------------- | ----------------------------------------- |
| `public/images/hero.jpg`            | Francis Odeyemi | https://unsplash.com/photos/jLKDfxikHzM   |
| `public/images/formations.jpg`      | wocintechchat   | https://unsplash.com/photos/50TkCaP8M3A   |
| `public/images/reseaux.jpg`         | Maiye Jeremiah  | https://unsplash.com/photos/YYNDDVjk9qg   |
| `public/images/vente.jpg`           | Ali Mkumbwa     | https://unsplash.com/photos/5dFuO02OHh0   |
| `public/images/video.jpg`           | Vitaly Gariev   | https://unsplash.com/photos/C5cbpx97MRI   |
| `public/images/accompagnement.jpg`  | Ezebunwo Omachi | https://unsplash.com/photos/nCM0_aO8zg0   |
