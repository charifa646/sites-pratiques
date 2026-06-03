# ASSETS.md — Direction visuelle & images · KORA TRANSIT

---

## ⚡ DIRECTIVE PRINCIPALE — SOIS AMBITIEUX

Ce site ne doit PAS ressembler à un template générique. Vise un rendu d'agence premium, niveau Awwwards.
Étudie les images du dossier `inspiration/` et inspire-toi de leur niveau de sophistication — PAS de leur contenu (ce sont des sites auto/logistique, nous faisons du transport de voyageurs).

Tu as le droit — et le DEVOIR — de pousser loin :
- Typographie surdimensionnée et expressive
- Profondeur et superposition (layering) des éléments
- Animations motion design riches (utilise le MCP 21st.dev)
- Mises en page asymétriques et éditoriales
- Effets de lumière, halos, dégradés en mouvement

**Reste cohérent avec la marque (navy + or, premium, sobre) mais ne te bride pas sur l'exécution visuelle.**

---

## Palette (rappel — strict)
| Rôle | Hex |
|---|---|
| Fond principal | `#0B1628` |
| Surface carte | `#111F35` |
| Bordure subtile | `#1E2E45` |
| Accent or | `#C9A84C` |
| Texte principal | `#F5F5F0` |
| Texte secondaire | `#A0A8B8` |

Dégradés autorisés : navy → noir profond pour la profondeur. Halo or subtil derrière les véhicules.

---

## Typographie
- **Titres** : Poppins Bold / ExtraBold
- **Corps** : Inter
- **Style hero** : titres TRÈS grands (jusqu'à 96-120px desktop sur le hero), letter-spacing serré
- Possibilité d'un mot de marque géant en arrière-plan (faible opacité) façon référence Audi/Porsche

---

## ADN visuel à reproduire (extrait des inspirations)

### Hero
- Fond navy profond + halo or diffus
- Grand visuel de bus/car premium (pas de voiture de luxe — un autocar moderne)
- Effet de lumière/glow doré sous le véhicule (façon camion néon Albatros 23)
- Titre surdimensionné + sous-titre + 2 CTA
- Vidéo en arrière-plan possible (route de nuit, phares)

### Sections numérotées
- Marqueurs `01` `02` `03` en or, gros, à côté des titres de section

### Section services (grille bento)
- Layout bento asymétrique (cartes de tailles variables) façon MAKEDO
- Cartes en glassmorphism (fond semi-transparent, bordure subtile or)
- Micro-animations au hover

### Section chiffres
- Gros compteurs animés (incrément au scroll) façon Audi : 500 000+ · 15 · 12 ans · 98%
- Chiffres très grands en or, label en gris dessous

### Cartes de localisation / trajets
- Cartes animées montrant les liaisons (ville départ → ville arrivée)
- Ligne animée/pointillés entre les deux villes
- Effet de tracé qui se dessine au scroll

### Flotte
- Présentation des 3 classes (Standard / Business / Premium) en cartes premium
- Image de chaque type de véhicule + équipements listés
- La classe Premium mise en avant (bordure or, badge)

---

## IMAGES — Sources Unsplash (Claude Code va chercher tout seul)

Récupère des images libres de droits depuis Unsplash selon ces termes. Privilégie les visuels sombres, premium, qui s'intègrent au thème navy.

| Emplacement | Termes de recherche Unsplash |
|---|---|
| Hero | `modern coach bus night`, `luxury bus highway dusk`, `intercity bus road` |
| Services - voyageurs | `bus interior premium seats`, `coach passengers comfort` |
| Services - fret | `cargo truck logistics`, `delivery van road africa` |
| Services - VIP | `luxury van interior`, `chauffeur black car` |
| Flotte Standard | `modern city bus exterior` |
| Flotte Business | `premium coach bus interior` |
| Flotte Premium | `luxury minibus interior leather` |
| À propos | `west africa road landscape`, `bus terminal modern` |
| Texture/fond | `dark abstract road motion blur`, `night highway lights` |

Règles :
- Toujours `next/image` avec width/height
- Privilégier les images en tonalité sombre pour cohérence
- Overlay navy `rgba(11,22,40,0.5)` sur les images de fond pour lisibilité du texte

---

## Dossier inspiration
6 images de référence dans `inspiration/`. Les étudier pour le NIVEAU de finition et la disposition des éléments. Ne pas copier le contenu (automobile) — transposer au transport de voyageurs.

---

## Iconographie
- Style : ligne fine (outline), couleur or ou blanc
- Bibliothèque suggérée : lucide-react
- Icônes pour : ponctualité (horloge), sécurité (bouclier), confort (siège), wifi, GPS, bagages
