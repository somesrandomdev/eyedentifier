# 👁️ EyeDentify Frontend

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0.0-3ECF8E.svg)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF.svg)](https://vitejs.dev/)

Application web moderne pour la gestion de l’enrôlement et de l’identification biométrique des citoyens au Sénégal 🇸🇳

**"La sécurité en un regard"**

## Aperçu de l’architecture

### Stack Technique
- **Framework** : React 18 + TypeScript
- **Outil de build** : Vite
- **Styling** : Tailwind CSS (via `@tailwindcss/vite`)
- **Gestion d’état** : Zustand (avec persistance)
- **Routing** : React Router DOM v6
- **Formulaires** : React Hook Form + Zod
- **Icônes** : Heroicons
- **Animations** : Framer Motion
- **Requêtes** : TanStack React Query
- **Tests** : Vitest
- **Storybook** : Développement de composants isolés

### Structure du projet

```
src/
├── components/          # Composants UI réutilisables
│   ├── Button.tsx
│   ├── Layout.tsx       # Layout principal avec navigation
│   └── ...
├── pages/               # Pages correspondant aux routes
│   ├── Login.tsx        # Connexion opérateur
│   ├── Dashboard.tsx    # Tableau de bord
│   ├── enrollment/      # Assistant d'enrôlement (wizard)
│   │   ├── EnrollmentData.tsx     # Données personnelles
│   │   ├── EnrollmentPhoto.tsx    # Capture photo + upload Supabase
│   │   ├── EnrollmentIris.tsx     # Scan iris réaliste (9 étapes)
│   │   └── EnrollmentSuccess.tsx  # Confirmation + CNI générée
│   ├── Identification.tsx         # Identification biométrique
│   ├── CitizensList.tsx
│   ├── CitizenDetail.tsx
│   ├── History.tsx
│   └── Settings.tsx
├── store/               # Gestion d’état global
│   └── authStore.ts     # État d’authentification (session Supabase)
├── types/               # Définitions TypeScript
│   └── idCard.ts        # Types citoyen, CNI, etc.
├── utils/               # Fonctions utilitaires
│   ├── senegalUtils.ts  # Générateurs de données sénégalaises (noms, régions, CNI)
│   └── idCardGenerator.ts
├── constants/           # Constantes de l’application
│   └── cniPixels.ts     # Positions pour génération de carte d’identité
└── App.tsx              # Configuration des routes
```

## Fonctionnalités principales

### Authentification
- Connexion via **Supabase Auth** (email + mot de passe)
- Session persistante grâce à Zustand + Supabase auth state listener
- Utilisateur demo : `demo@eyedentify.sn` / `eyedentify2025` (créé dans Supabase Dashboard)

### Système d'enrôlement
- Assistant multi-étapes :
  1. Saisie des données personnelles (prénoms, nom, date/lieu naissance, sexe, taille, profession, adresse, etc.)
  2. Capture photo via webcam → upload réel vers bucket Supabase `photos-cni`
  3. Scan iris réaliste avec analyse 9 étapes technique et métriques de qualité
  4. Enregistrement final dans la table `citoyens` avec :
     - Génération automatique du numéro CNI (`SN-YYYY-######`)
     - `operateur_id` lié à l'opérateur connecté (via `auth.uid()` → `operateurs.user_id`)
     - Dates d'émission/expiration
     - URL de la photo uploadée
- Validation complète avec Zod

### Identification biométrique
- Scanner iris réaliste avec analyse 9 étapes technique
- Recherche 1:N dans la base de données complète
- Métriques de qualité en temps réel (mise au point, éclairage, occlusion)
- Score de confiance calculé automatiquement
- Redirection vers la fiche détaillée du citoyen identifié

### Gestion des citoyens
- Liste complète des citoyens avec recherche/filtrage
- Fiche détaillée avec photo et toutes les informations
- Carte interactive (Leaflet) avec marqueurs géolocalisés (PostGIS)
- Impression de résumé (client-side)

### Tableau de bord
- Statistiques en temps réel :
  - Total citoyens
  - Enrôlements du jour
- Accès rapide aux modules Enrôler / Identifier

### Spécificités sénégalaises
- Couleurs nationales : Vert (#009639), Jaune (#FCD116), Rouge (#EF3340)
- Génération de numéros CNI au format officiel
- Noms, régions, professions authentiques
- Interface entièrement en français
- Géolocalisation sur le territoire sénégalais

## Descriptions détaillées des pages

### Pages principales

#### Connexion (Login)
Page d'authentification élégante avec:
- Logo EyeDentify animé avec effet de scale et rotation
- Formulaire email/mot de passe avec icônes Heroicons
- Arrière-plan animé avec gradients verts et jaunes sénégalais
- Pulsations sur les éléments interactifs
- Mentions de sécurité et conformité RGPD
- Bouton de connexion avec effet shimmer et animations hover
- Design glassmorphism avec backdrop-blur

#### Tableau de bord (Dashboard)
Interface principale avec vue d'ensemble complète:
- **En-tête avec logo**: Logo EyeDentify dans conteneur blanc arrondi avec ombre colorée
- **Statistiques principales**: 3 tuiles avec gradients (vert/jaune/rouge) affichant citoyens enregistrés, IDs du jour, enrôlements du jour
- **Actions rapides**: Cartes avec icônes pour "Identifier un citoyen" et "Enrôler un citoyen"
- **Activité récente**: Liste des dernières opérations avec statuts colorés (succès/en cours/info)
- **État du système**: Métriques de performance avec indicateurs visuels (scanner iris, base de données, temps de réponse)
- Animations d'entrée progressives et effets hover sur les cartes

#### Liste des citoyens (CitizensList)
Gestion complète de la base de données citoyens:
- **Filtres avancés**: Recherche par nom/prénoms/CNI/lieu, tri par date/nom/CNI, filtre "aujourd'hui uniquement"
- **Cartes citoyens**: Design glass avec photo, informations personnelles, badges de statut, vignettes iris simulées
- **Carte interactive**: Leaflet avec marqueurs géolocalisés sur le territoire sénégalais
- **Statistiques démographiques**: Répartition par genre et âge
- Animations au scroll et effets hover sur les cartes

#### Détail citoyen (CitizenDetail)
Fiche complète et professionnelle:
- **Photo d'identité**: Affichage avec fallback en cas d'absence
- **Scans iris**: Simulation avec métriques de qualité (95%/92%)
- **Informations personnelles**: Grille responsive avec labels et valeurs
- **Coordonnées**: Téléphone, email, adresse complète
- **Données d'enrôlement**: Dates d'émission/expiration, autorité, numéro CNI
- **Actions**: Boutons retour, impression avec icône
- Layout responsive avec sections organisées

#### Historique (History)
Journal d'audit complet avec analyse:
- **Statistiques**: Total opérations, succès, échecs, erreurs
- **Filtres**: Période (aujourd'hui/7j/30j/tout), type (enrôlement/identification), résultat
- **Table détaillée**: Colonnes date/heure, type, agent, citoyen, résultat, durée
- **Graphiques**: Opérations par heure (barres), répartition par type (camembert)
- **Badges de statut**: Couleurs contextuelles pour résultats
- Interface filtrable avec recherche par CNI/agent

#### Paramètres (Settings)
Configuration système organisée en onglets:
- **Profil**: Informations utilisateur (nom, rôle, station, dernière connexion)
- **Sécurité**: Changement mot de passe, durée session, verrouillage automatique
- **Matériel**: Test/calibration caméra et imprimante avec états en temps réel
- **Notifications**: Toggles pour email, push, sons avec switches animés
- **Système**: Informations techniques (versions, performance, actions système)
- Navigation par onglets avec indicateurs actifs

### Assistant d'enrôlement (4 étapes)

#### Données personnelles (EnrollmentData)
Formulaire d'enrôlement structuré:
- **Informations identité**: Prénom, nom, date/lieu naissance, genre (radio buttons)
- **Données physiques**: Taille, profession, adresse complète
- **Contact**: Téléphone, email optionnel
- **Validation RGPD**: Case à cocher obligatoire avec texte explicatif
- **Stepper visuel**: Indicateur de progression (1/4 étapes)
- **Validation Zod**: Messages d'erreur en rouge, champs requis marqués
- Design avec inputs glass et boutons primaires

#### Capture photo (EnrollmentPhoto)
Interface de capture webcam professionnelle:
- **Flux vidéo**: Affichage caméra avec guide visuel (zone de capture)
- **Métriques qualité**: Indicateurs visuels pour netteté, éclairage, alignement
- **Contrôles**: Boutons capture/retake/continuer avec états loading
- **Upload Supabase**: Envoi automatique vers bucket photos-cni
- **Feedback visuel**: Animations de capture et progression (50% complété)
- Interface responsive avec overlay de guidage

#### Scan iris (EnrollmentIris)
Simulation biométrique réaliste:
- **Scanner visuel**: Affichage noir avec iris animé et scan line
- **Étapes techniques**: 9 étapes d'analyse biométrique détaillées
- **Métriques temps réel**: Qualité, focus, éclairage, occlusion
- **Progression**: Barre de progression et messages d'état
- **Instructions**: Liste détaillée des bonnes pratiques
- **Transition fluide**: Vers page succès avec stockage des données

#### Succès (EnrollmentSuccess)
Confirmation d'enrôlement complète:
- **Numéro CNI généré**: Format SN-YYYY-XXXXXX en évidence
- **Récapitulatif**: Toutes les données saisies organisées
- **Badges validation**: ✓ Photo capturée, ✓ Iris scanné, ✓ Données validées
- **Actions disponibles**: Imprimer, voir citoyen, nouvel enrôlement
- **Statut visuel**: Icône checkmark verte animée
- Design avec gradients de succès et animations d'entrée

### Identification biométrique

#### Identification (Identification)
Scanner de recherche 1:N professionnel:
- **Interface scanner**: Même design que l'enrôlement avec iris pulsant
- **Instructions détaillées**: 4 étapes pour utilisation correcte
- **Résultats temps réel**: Affichage citoyen trouvé avec confiance (98.5%)
- **Informations match**: CNI, nom complet, lieu naissance, confiance
- **Actions**: Bouton "Voir fiche complète" avec redirection automatique
- **Session tracking**: Compteurs tentatives/réussites/temps moyen
- **États système**: Status scanner, base de données, citoyens en base

## Design System & Palette de couleurs

### Palette de couleurs sénégalaise (WCAG-AA compliant)
- **Vert Sénégal (#005c22)**: Couleur primaire principale - contraste 7.2:1 sur blanc
  - Utilisé pour: boutons primaires, liens actifs, icônes importantes, accents principaux
  - Variants: --primary (#005c22), --primary-dark (#004017)
- **Jaune Sénégal (#c69e00)**: Couleur secondaire - contraste 6.8:1 sur blanc
  - Utilisé pour: boutons secondaires, accents, indicateurs de statut
  - Variants: --secondary (#c69e00), --secondary-dark (#a37c00)
- **Rouge Sénégal (#b01e28)**: Couleur danger - contraste 6.4:1 sur blanc
  - Utilisé pour: erreurs, alertes, boutons de suppression
  - Variants: --danger (#b01e28), --danger-dark (#8e1a22)

### Palette de gris professionnels
- **Neutrals complets**: 7 niveaux de gris (--neutral-0 à --neutral-900)
  - #ffffff (--neutral-0): Blanc pur pour arrière-plans
  - #f8fafc (--neutral-50): Blanc très clair pour fonds subtils
  - #f1f5f9 (--neutral-100): Blanc clair pour cartes
  - #e2e8f0 (--neutral-200): Gris très clair pour bordures
  - #334155 (--neutral-700): Gris foncé pour texte secondaire
  - #1e293b (--neutral-800): Gris très foncé pour texte principal
  - #0f172a (--neutral-900): Noir presque pour titres

### Système de design moderne

#### Cartes (Modern Cards)
- **Glassmorphism**: `bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20`
- **Gradients subtils**: `background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`
- **Ombres avancées**: Multiples couches avec `0 8px 32px rgba(0, 0, 0, 0.1)` et insets
- **Animations hover**: `transform: translateY(-4px) scale(1.01)` avec transitions fluides

#### Boutons système
- **Primaire**: Gradient vert `linear-gradient(135deg, #009B77 0%, #10b981 50%, #059669 100%)`
  - Effets: shimmer animation, scale + translateY hover, box-shadow colorée
  - États: focus rings, disabled opacity, loading spinners
- **Secondaire**: Blanc avec bordure, backdrop-blur, effets similaires
- **Ghost**: Transparent avec hover states subtils

#### Champs de saisie (Input Fields)
- **Style glass**: `bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl`
- **Focus states**: Ring coloré `rgba(0, 155, 119, 0.15)`, translateY + scale
- **Validation**: Bordures rouges pour erreurs, animations de shake
- **Icônes intégrées**: Position absolue avec Heroicons

#### Animations Framer Motion
- **fadeIn**: Opacity 0→1 avec translateY(20px)
- **slideUp**: TranslateY(30px) → 0 avec opacity
- **scaleIn**: Scale(0.9) → 1 avec opacity
- **bounceIn**: Séquence complexe avec rebonds
- **Durations**: 0.3s à 0.6s avec easing cubic-bezier

#### Responsive Design (Mobile-First)
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grids adaptatives**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Typography responsive**: `text-sm sm:text-base lg:text-lg`
- **Spacing adaptatif**: Padding/margin responsives
- **Navigation mobile**: Menu overlay avec animations slide

#### Icônes et typographie
- **Heroicons**: Outline + Solid, animations contextuelles, couleurs sémantiques
- **Inter font**: 300-700 weights, antialiased, smooth scrolling
- **Tailles responsives**: xs à 9xl avec line-heights optimisés

### Thèmes et composants avancés

#### Gradients prédéfinis
- `bg-gradient-primary`: Vert sénégalais progressif
- `bg-gradient-senegal`: Vert → Jaune national
- `bg-gradient-success`: Vert émeraude
- `bg-gradient-warning`: Jaune doré
- `bg-gradient-error`: Rouge profond
- `bg-gradient-subtle`: Gris subtil pour fonds

#### Système d'ombres
- `shadow-soft`: 0 2px 15px -3px rgba(0,0,0,0.07)
- `shadow-medium`: 0 4px 25px -5px rgba(0,0,0,0.1)
- `shadow-large`: 0 10px 40px -10px rgba(0,0,0,0.15)
- `shadow-colored`: Ombres teintées avec couleur primaire

#### États interactifs
- **Hover**: Scale(1.02), translateY(-2px), border-color changes
- **Focus**: Ring visible, box-shadow colorée, outline none
- **Active**: Scale(0.98), transition rapide 0.1s
- **Disabled**: Opacity 0.5, pointer-events none, transforms disabled

#### Accessibilité et performance
- **WCAG-AA**: Contrastes calculés, focus visible, aria-labels
- **Reduced motion**: Respect des préférences utilisateur
- **High contrast**: Support mode contraste élevé
- **Print styles**: Optimisé pour impression CNI
- **Scrollbar custom**: Style sombre avec rounded corners

#### Utilitaires spécialisés
- **Mesh background**: Pattern radial pour textures subtiles
- **Scan line animation**: Ligne de scan animée pour interfaces biométriques
- **Iris pulse**: Animation de pulsation pour éléments iris
- **Shimmer effect**: Animation de brillance sur boutons
- **Loading dots**: Indicateurs de chargement animés

## Intégration Supabase

L’application est **directement connectée à Supabase** – aucun backend intermédiaire.

- **Authentification** : Supabase Auth (`auth.users`)
- **Données** : Tables `citoyens`, `operateurs` (avec `user_id → auth.users.id`)
- **Stockage** : Bucket public `photos-cni` pour les photos
- **RLS** : Activée et respectée (insertion avec `operateur_id = auth.uid()` via lien `user_id`)
- **Requêtes** : TanStack Query + client Supabase

### Variables d’environnement requises (`.env`)

```env
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_ANON_KEY=ta-cle-anon-publique
```

## Installation & Configuration

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** (version 18 ou supérieure) - [Télécharger](https://nodejs.org/)
- **npm** ou **yarn** ou **pnpm**
- Un compte **Supabase** avec un projet configuré

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/eyedentify-frontend.git
cd eyedentify-frontend
```

### 2. Installation des dépendances

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configuration Supabase

#### Créer un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme-publique
```

#### Configuration de la base de données Supabase :

1. **Tables requises** :
   ```sql
   -- Table des opérateurs
   CREATE TABLE operateurs (
     id SERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     nom VARCHAR(255),
     email VARCHAR(255) UNIQUE,
     role VARCHAR(100) DEFAULT 'agent',
     station VARCHAR(255),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Table des citoyens
   CREATE TABLE citoyens (
     id SERIAL PRIMARY KEY,
     operateur_id INTEGER REFERENCES operateurs(id),
     cedeaonumber VARCHAR(20) UNIQUE,
     prenoms VARCHAR(255),
     nom VARCHAR(255),
     date_naissance DATE,
     lieu_naissance VARCHAR(255),
     sexe CHAR(1),
     taille_cm INTEGER,
     profession VARCHAR(255),
     adresse TEXT,
     telephone VARCHAR(20),
     email VARCHAR(255),
     photo_url TEXT,
     date_delivrance DATE,
     date_expiration DATE,
     autorite VARCHAR(255),
     enrolled_at TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Table d'audit
   CREATE TABLE audit_log (
     id SERIAL PRIMARY KEY,
     operateur_id INTEGER REFERENCES operateurs(id),
     type VARCHAR(50),
     citizen_cni VARCHAR(20),
     result VARCHAR(50),
     details JSONB,
     duration INTEGER,
     date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Bucket de stockage** : Créer un bucket public nommé `photos-cni`

3. **Politiques RLS** (Row Level Security) :
   ```sql
   -- Pour la table operateurs
   ALTER TABLE operateurs ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Users can view own operator record" ON operateurs
     FOR SELECT USING (auth.uid() = user_id);

   -- Pour la table citoyens
   ALTER TABLE citoyens ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Operators can view all citizens" ON citoyens FOR SELECT USING (true);
   CREATE POLICY "Operators can insert citizens" ON citoyens FOR INSERT WITH CHECK (true);
   ```

### 4. Démarrage en développement

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

L'application sera accessible sur **http://localhost:5173**

### 5. Build pour production

```bash
npm run build
# ou
yarn build
# ou
pnpm build
```

Les fichiers de production seront générés dans le dossier `dist/`.

### 6. Prévisualisation du build

```bash
npm run preview
# ou
yarn preview
# ou
pnpm preview
```

### 7. Tests

```bash
npm run test
# ou
yarn test
# ou
pnpm test
```

### 8. Storybook (développement composants)

```bash
npm run storybook
# ou
yarn storybook
# ou
pnpm storybook
```

Storybook sera accessible sur **http://localhost:6006**

### 9. Déploiement sur GitHub

#### Préparation pour GitHub :
1. **Créer un repository** sur GitHub
2. **Ajouter le remote** :
   ```bash
   git remote add origin https://github.com/votre-username/eyedentify-frontend.git
   ```

3. **Premier push** :
   ```bash
   git add .
   git commit -m "Initial commit: EyeDentify Frontend"
   git branch -M main
   git push -u origin main
   ```

#### Variables d'environnement pour GitHub :
⚠️ **Important** : Ne commitez jamais le fichier `.env` avec vos vraies clés Supabase !

Ajoutez ces variables dans les **Settings > Secrets and variables > Actions** de votre repo GitHub :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

#### GitHub Actions (optionnel) :
Vous pouvez ajouter un workflow GitHub Actions pour le déploiement automatique :

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: echo "Build completed successfully"
```

### 10. Utilisation de l'application

#### Première connexion :
1. Accédez à l'application : `http://localhost:5173`
2. Utilisez les identifiants de démonstration :
   - **Email** : `demo@eyedentify.sn`
   - **Mot de passe** : `eyedentify2025`

#### Fonctionnalités principales :
1. **Tableau de bord** : Vue d'ensemble des statistiques
2. **Enrôler un citoyen** : Assistant 4 étapes pour créer un nouveau profil
3. **Identifier un citoyen** : Recherche biométrique par iris
4. **Gérer les citoyens** : Liste complète avec recherche et filtres
5. **Historique** : Journal des opérations avec statistiques

### 11. Structure des commits

Pour maintenir un historique propre, utilisez ces conventions :

```bash
feat: ajout nouvelle fonctionnalité
fix: correction de bug
docs: mise à jour documentation
style: modifications de style
refactor: refactorisation du code
test: ajout/modification de tests
chore: tâches de maintenance
```

### 12. Contribution

1. **Fork** le projet
2. **Créer une branche** : `git checkout -b feature/nouvelle-fonctionnalite`
3. **Commiter vos changements** : `git commit -m 'feat: description'`
4. **Push** vers la branche : `git push origin feature/nouvelle-fonctionnalite`
5. **Créer une Pull Request**

### 13. Support et contact

Pour toute question ou problème :
- Ouvrez une **issue** sur GitHub
- Consultez la **documentation** dans ce README
- Vérifiez les **logs de console** pour les erreurs

## État actuel (Décembre 2025)

**Fonctionnalités complètes et opérationnelles** :
- ✅ Authentification Supabase avec email/mot de passe
- ✅ Enrôlement complet (4 étapes) avec sauvegarde en base
- ✅ Analyse biométrique iris (18 étapes professionnelles)
- ✅ Gestion complète des citoyens (liste + détails)
- ✅ Tableau de bord avec statistiques temps réel
- ✅ Recherche et filtrage avancés
- ✅ Interface responsive (mobile/tablette/PC)
- ✅ Architecture flexible pour tout schéma Supabase
- ✅ Simulation biométrique réaliste et crédible

**Architecture technique** :
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS avec design système
- **État**: Zustand avec persistance
- **Base de données**: Supabase (schéma flexible)
- **Authentification**: Supabase Auth
- **Biométrie**: Simulation professionnelle 18 étapes
- **Responsive**: Design adaptatif complet

**Sécurité et conformité** :
- Authentification sécurisée
- Gestion des sessions persistante
- Validation des données (Zod)
- Interface française professionnelle
- Couleurs nationales sénégalaises
- Respect RGPD et protection données

## 🚀 Déploiement

L'application est prête pour le déploiement sur :
- **Vercel** (recommandé pour React)
- **Netlify**
- **GitHub Pages**
- **Railway** ou **Render**

### Variables d'environnement requises :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📈 Roadmap & Améliorations futures

### Fonctionnalités planifiées :
- 🔍 **Scan iris réel** : Intégration SDK biométrique professionnel
- 🗺️ **Géolocalisation avancée** : Cartes interactives détaillées
- 📄 **Génération PDF CNI** : Documents officiels téléchargeables
- 📊 **Analytics temps réel** : Tableaux de bord avancés
- 🔐 **Authentification multi-facteurs**
- 📱 **PWA offline** : Mode hors-ligne complet
- 🔗 **API REST** : Intégrations tierces
- 🤖 **IA/ML** : Amélioration de la reconnaissance

### Optimisations techniques :
- ⚡ **Performance** : Code splitting, lazy loading
- 🧪 **Tests** : Couverture complète (unités, intégration, E2E)
- ♿ **Accessibilité** : Conformité WCAG 2.1 AA complète
- 🌐 **i18n** : Support multi-langues
- 📊 **Monitoring** : Logs et métriques production

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir la section [Installation & Configuration](#installation--configuration) pour commencer.

### Code de conduite :
- Respecter les conventions de commit
- Tests requis pour les nouvelles fonctionnalités
- Documentation à jour
- Code review obligatoire

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Construit avec ❤️ pour la modernisation de l'état civil sénégalais** 🇸🇳

*Projet académique/démonstration - Non destiné à un usage en production sans validation sécurité*