# AURA Cosmétiques — Application E-Commerce Front-End (Angular 21 & Tailwind CSS)

Application Front-End moderne, responsive et prête pour la production pour la boutique de cosmétiques et haute beauté végétale **AURA Cosmétiques**.

---

## 🌟 Caractéristiques & Stack Technique

- **Angular (dernière version 21+)** :
  - 100% **Standalone Components**
  - **Angular Signals** (`signal`, `computed`, `effect`) pour une gestion d'état ultra-performante et fine
  - Nouveau **Control Flow** natif (`@if`, `@for`, `@switch`)
  - **Reactive Forms** stricts avec typage et validations avancées
  - **HttpClient** avec `withFetch()` et `RxJS`
- **Tailwind CSS 3+** :
  - Design system mobile-first raffiné adapté à l'univers du luxe et des cosmétiques (teintes poudrées, or, rose, typographie serif Cormorant Garamond & sans-serif Plus Jakarta Sans)
  - Micro-interactions fluides et animations de transition
- **Persistance & Réactivité** :
  - Panier d'achat réactif (Signals + synchronisation `localStorage`, jauge dynamique de livraison offerte)
  - Liste de favoris réactive (Signals + synchronisation `localStorage`)
- **Architecture Modulaire** :
  - Séparation stricte entre Modèles/DTOs, Services, Composants UI et Pages
  - Zéro `// TODO`

---

## 🧭 Plan du Site & Fonctionnalités

1. **Layout Global** :
   - Bandeau supérieur luxe avec livraison offerte et échantillons
   - Barre de navigation responsive avec recherche instantanée, compteur animé de favoris, compteur réactif de panier et menu burger mobile
   - Pied de page complet avec 4 piliers de réassurance, newsletter et liens
2. **Accueil (`/`)** :
   - Hero banner avec accroche éditoriale et doubles boutons d'action
   - Univers de soins & catégories vedettes
   - Sélection des nouveautés et coups de cœur
   - Section manifeste et savoir-faire botanique
3. **Catalogue & Boutique (`/catalog`)** :
   - Grille responsive avec cartes produits soignées
   - Filtres en temps réel : Catégories, Marques, Prix max (slider), Note minimale (étoiles), Disponibilité
   - Tri dynamique (pertinence, prix croissant/décroissant, notes, ordre alphabétique)
4. **Fiche Produit Détaillée (`/product/:id`)** :
   - Galerie d'images haute définition avec miniatures cliquables
   - Descriptif olfactif et botanique, note client détaillée
   - Badge de disponibilité et suivi des stocks en temps réel
   - Sélecteur de quantité (+ / -) avec respect du stock
   - Bouton d'ajout rapide avec retour visuel immédiat
   - Recommandations de soins complémentaires
5. **Panier d'Achat (`/cart`)** :
   - Liste des articles, modification des quantités, suppression
   - Jauge interactive de progression vers la livraison offerte (palier à 50€)
   - Récapitulatif précis (sous-total, livraison offerte ou standard, total)
6. **Tunnel de Commande (`/checkout`)** :
   - Formulaire réactif avec validation stricte (nom, email, téléphone, adresse)
   - Envoi vers l'API REST `POST /api/orders`
   - Écran de confirmation de commande avec référence et récapitulatif
7. **Mes Favoris (`/favorites`)** :
   - Gestion réactive des coups de cœur sauvegardés
   - Possibilité de vider la sélection ou d'ajouter directement au panier
8. **Espace Administration (`/admin`)** :
   - **Dashboard** : KPIs temps réel (chiffre d'affaires, commandes, volume catalogue, alertes stock faible) et tableau des commandes récentes
   - **Gestion des Soins** : Tableau CRUD avec filtres, modal réactif d'ajout/modification, confirmation de suppression (`POST`, `PUT`, `DELETE /api/products`)
   - **Gestion des Commandes** : Suivi logistique et changement instantané de statut (`PUT /api/orders/{id}/status`)

---

## 📡 Intégration API REST (Base : `http://localhost:8080`)

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Liste de tous les soins |
| `POST` | `/api/products` | Création d'un soin |
| `GET` | `/api/products/{id}` | Détail d'un soin par ID |
| `PUT` | `/api/products/{id}` | Modification d'un soin |
| `DELETE` | `/api/products/{id}` | Suppression d'un soin |
| `GET` | `/api/categories` | Liste des catégories |
| `POST` | `/api/orders` | Création d'une commande (Checkout) |
| `GET` | `/api/orders` | Liste des commandes (Admin) |
| `PUT` | `/api/orders/{id}/status` | Changement de statut d'une commande |
| `GET` | `/api/dashboard/stats` | Statistiques globales du dashboard |

> Configuration de l'URL d'API modifiable dans `src/environments/environment.ts`.

---

## 🚀 Installation & Démarrage

### 1. Prérequis
- **Node.js** v18+ (ou v20/v22 recommandé)
- **npm** v9+

### 2. Installation des dépendances
```bash
npm install
```

### 3. Lancement du serveur de développement
```bash
npm start
# ou
npx ng serve --open
```
L'application sera accessible sur [http://localhost:4200](http://localhost:4200).

### 4. Build de production
```bash
npm run build
```
Les fichiers optimisés et minifiés sont générés dans le répertoire `dist/cosmetic-ecommerce`.
