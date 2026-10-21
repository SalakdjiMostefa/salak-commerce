import { Routes } from '@angular/router';
import { adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'AURA Cosmétiques — Accueil & Haute Beauté Botanique'
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./pages/catalog/catalog.component').then((m) => m.CatalogComponent),
    title: 'Catalogue & Rituels de Soins — AURA Cosmétiques'
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
    title: 'Détail du Soin — AURA Cosmétiques'
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites/favorites.component').then((m) => m.FavoritesComponent),
    title: 'Mes Favoris — AURA Cosmétiques'
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
    title: 'Mon Panier — AURA Cosmétiques'
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent),
    title: 'Finalisation de commande — AURA Cosmétiques'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Espace Membre & Connexion — AURA Cosmétiques'
  },
  {
    path: 'register',
    redirectTo: 'login'
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
        title: 'Administration — Tableau de Bord'
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/admin/products/admin-products.component').then((m) => m.AdminProductsComponent),
        title: 'Administration — Catalogue Produits'
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/admin/categories/admin-categories.component').then((m) => m.AdminCategoriesComponent),
        title: 'Administration — Catégories de Soins'
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/admin/orders/admin-orders.component').then((m) => m.AdminOrdersComponent),
        title: 'Administration — Gestion des Commandes'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
