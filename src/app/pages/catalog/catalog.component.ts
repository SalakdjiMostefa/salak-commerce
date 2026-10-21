import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductDTO, ProductStatus } from '../../models/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  template: `
    <div class="bg-stone-50/50 min-h-screen py-8 sm:py-12">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <!-- En-tête Catalogue -->
        <div class="border-b border-stone-200 pb-8 mb-8">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Boutique Haute Beauté</span>
              <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 mt-1">
                Le Catalogue de Soins
              </h1>
              <p class="text-xs sm:text-sm text-stone-500 font-light mt-2 max-w-2xl">
                Explorez l'intégralité de nos rituels cosmétiques et trouvez la formule parfaite pour révéler votre teint.
              </p>
            </div>

            <!-- Compteur & Tri -->
            <div class="flex items-center gap-4 self-start md:self-end">
              <span class="text-xs text-stone-500 font-medium">
                {{ filteredProducts().length }} soin(s) trouvé(s)
              </span>

              <!-- Select Tri -->
              <div class="relative">
                <select
                  [(ngModel)]="selectedSort"
                  class="rounded-xl border border-stone-300 bg-white py-2 pl-3 pr-8 text-xs font-medium text-stone-700 shadow-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                >
                  <option value="featured">Pertinence & Nouveautés</option>
                  <option value="price-asc">Prix : croissant</option>
                  <option value="price-desc">Prix : décroissant</option>
                  <option value="rating-desc">Meilleures notes</option>
                  <option value="name-asc">Nom (A - Z)</option>
                </select>
              </div>

              <!-- Bouton Filtres Mobile Toggle -->
              <button
                type="button"
                (click)="mobileFiltersOpen.set(!mobileFiltersOpen())"
                class="lg:hidden flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-sm"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filtres</span>
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <!-- SIDEBAR FILTRES (Desktop + Mobile Drawer) -->
          <aside
            class="space-y-6"
            [class.hidden]="!mobileFiltersOpen()"
            [class.block]="mobileFiltersOpen()"
            [ngClass]="{ 'lg:block': true }"
          >
            <div class="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm space-y-6">

              <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 class="font-serif text-lg font-medium text-stone-900">Filtres de recherche</h3>
                @if (hasActiveFilters()) {
                  <button
                    type="button"
                    (click)="resetFilters()"
                    class="text-xs text-rose-600 hover:text-rose-800 font-medium underline"
                  >
                    Effacer tout
                  </button>
                }
              </div>

              <!-- Recherche textuelle -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">Recherche</label>
                <div class="relative">
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    placeholder="Nom, marque, mot-clé..."
                    class="w-full rounded-xl border border-stone-200 bg-stone-50/60 py-2 pl-8 pr-3 text-xs text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:bg-white focus:outline-none"
                  />
                  <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <!-- Filtre par Catégorie -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">Catégorie</label>
                <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    type="button"
                    (click)="selectedCategory = ''"
                    class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between"
                    [ngClass]="selectedCategory === '' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:bg-stone-100'"
                  >
                    <span>Toutes les catégories</span>
                    <span>{{ allProducts().length }}</span>
                  </button>
                  @for (cat of categories(); track cat.id) {
                    <button
                      type="button"
                      (click)="selectedCategory = cat.name"
                      class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between"
                      [ngClass]="selectedCategory === cat.name ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:bg-stone-100'"
                    >
                      <span>{{ cat.name }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Filtre par Marque -->
              @if (availableBrands().length > 0) {
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">Marque</label>
                  <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    <button
                      type="button"
                      (click)="selectedBrand = ''"
                      class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                      [ngClass]="selectedBrand === '' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:bg-stone-100'"
                    >
                      Toutes les marques
                    </button>
                    @for (b of availableBrands(); track b) {
                      <button
                        type="button"
                        (click)="selectedBrand = b"
                        class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                        [ngClass]="selectedBrand === b ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:bg-stone-100'"
                      >
                        {{ b }}
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Filtre par Prix Max (Slider) -->
              <div>
                <div class="flex items-center justify-between text-xs mb-2">
                  <span class="font-semibold uppercase tracking-wider text-stone-600">Prix Maximum</span>
                  <span class="font-bold text-stone-900">{{ maxPrice }} €</span>
                </div>
                <input
                  type="range"
                  min="0"
                  [max]="highestPrice()"
                  step="1"
                  [(ngModel)]="maxPrice"
                  class="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
                <div class="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>0 €</span>
                  <span>{{ highestPrice() }} €</span>
                </div>
              </div>

              <!-- Filtre par Note minimale -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">Note Minimale</label>
                <div class="grid grid-cols-4 gap-1.5">
                  @for (star of [0, 3, 4, 4.5]; track star) {
                    <button
                      type="button"
                      (click)="minRating = star"
                      class="py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all"
                      [ngClass]="minRating === star ? 'border-amber-600 bg-amber-50 text-amber-900 font-semibold' : 'border-stone-200 text-stone-600 hover:bg-stone-50'"
                    >
                      {{ star === 0 ? 'Toutes' : star + '★+' }}
                    </button>
                  }
                </div>
              </div>

              <!-- Filtre par Disponibilité / Statut -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">Disponibilité</label>
                <div class="space-y-1.5">
                  <label class="flex items-center text-xs text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="statusFilter"
                      value=""
                      [(ngModel)]="selectedStatus"
                      class="h-3.5 w-3.5 text-stone-900 accent-stone-900 mr-2"
                    />
                    <span>Tous les produits</span>
                  </label>
                  <label class="flex items-center text-xs text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="statusFilter"
                      value="EN_STOCK"
                      [(ngModel)]="selectedStatus"
                      class="h-3.5 w-3.5 text-stone-900 accent-stone-900 mr-2"
                    />
                    <span>En stock uniquement</span>
                  </label>
                  <label class="flex items-center text-xs text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="statusFilter"
                      value="NOUVEAU"
                      [(ngModel)]="selectedStatus"
                      class="h-3.5 w-3.5 text-stone-900 accent-stone-900 mr-2"
                    />
                    <span>Nouveautés</span>
                  </label>
                </div>
              </div>

            </div>
          </aside>

          <!-- GRILLE DE PRODUITS (3 colonnes) -->
          <main class="lg:col-span-3">
            @if (productService.loading()) {
              <!-- Loading Skeleton -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (item of [1, 2, 3, 4, 5, 6]; track item) {
                  <div class="animate-pulse rounded-2xl bg-white p-4 border border-stone-200/60 shadow-sm space-y-4">
                    <div class="aspect-square w-full rounded-xl bg-stone-200"></div>
                    <div class="h-4 w-1/3 bg-stone-200 rounded"></div>
                    <div class="h-5 w-3/4 bg-stone-200 rounded"></div>
                    <div class="h-4 w-1/2 bg-stone-200 rounded"></div>
                  </div>
                }
              </div>
            } @else if (filteredProducts().length > 0) {
              <!-- Product Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (prod of filteredProducts(); track prod.id) {
                  <app-product-card [product]="prod" />
                }
              </div>
            } @else {
              <!-- Aucun Produit Trouvé -->
              <div class="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-sm">
                <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                  <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 class="font-serif text-2xl font-medium text-stone-900 mt-4">Aucun soin ne correspond à ces critères</h3>
                <p class="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto">
                  Essayez d'ajuster votre budget ou d'élargir vos filtres de catégorie et de note pour découvrir nos rituels.
                </p>
                <div class="mt-6">
                  <button
                    type="button"
                    (click)="resetFilters()"
                    class="rounded-full bg-stone-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-stone-800 transition-all"
                  >
                    Réinitialiser tous les filtres
                  </button>
                </div>
              </div>
            }
          </main>

        </div>
      </div>
    </div>
  `
})
export class CatalogComponent implements OnInit {
  readonly productService = inject(ProductService);
  readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);

  readonly allProducts = this.productService.products;
  readonly categories = this.categoryService.categories;

  // Filtres d'état
  searchQuery = '';
  selectedCategory = '';
  selectedBrand = '';
  selectedStatus = '';
  minRating = 0;
  maxPrice = 500;
  selectedSort = 'featured';

  readonly mobileFiltersOpen = signal<boolean>(false);

  // Plus haut prix disponible
  readonly highestPrice = computed(() => {
    const list = this.allProducts();
    if (list.length === 0) return 300;
    const max = Math.max(...list.map((p) => p.price));
    return Math.ceil(max) || 300;
  });

  // Liste unique des marques
  readonly availableBrands = computed(() => {
    const list = this.allProducts();
    const brands = new Set<string>();
    list.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  });

  // Filtrage et Tri en temps réel
  readonly filteredProducts = computed(() => {
    let list = [...this.allProducts()];

    // Recherche mot-clé
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Filtre Catégorie
    if (this.selectedCategory) {
      list = list.filter((p) => {
        if (typeof p.category === 'object' && p.category !== null) {
          return p.category.name.toLowerCase() === this.selectedCategory.toLowerCase();
        }
        return String(p.category).toLowerCase() === this.selectedCategory.toLowerCase();
      });
    }

    // Filtre Marque
    if (this.selectedBrand) {
      list = list.filter((p) => p.brand === this.selectedBrand);
    }

    // Filtre Statut
    if (this.selectedStatus) {
      list = list.filter((p) => p.status === this.selectedStatus);
    }

    // Filtre Prix Max
    list = list.filter((p) => p.price <= this.maxPrice);

    // Filtre Note
    if (this.minRating > 0) {
      list = list.filter((p) => (p.rating || 0) >= this.minRating);
    }

    // Tri
    switch (this.selectedSort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        // Priorité aux nouveautés puis meilleures notes
        list.sort((a, b) => {
          if (a.status === 'NOUVEAU' && b.status !== 'NOUVEAU') return -1;
          if (b.status === 'NOUVEAU' && a.status !== 'NOUVEAU') return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
    }

    return list;
  });

  hasActiveFilters(): boolean {
    return (
      this.searchQuery !== '' ||
      this.selectedCategory !== '' ||
      this.selectedBrand !== '' ||
      this.selectedStatus !== '' ||
      this.minRating > 0 ||
      this.maxPrice < this.highestPrice()
    );
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.selectedStatus = '';
    this.minRating = 0;
    this.maxPrice = this.highestPrice();
    this.selectedSort = 'featured';
  }

  ngOnInit(): void {
    if (this.allProducts().length === 0) {
      this.productService.loadProducts();
    }
    if (this.categories().length === 0) {
      this.categoryService.loadCategories();
    }

    // Lecture des paramètres d'URL (recherche, catégorie, filtre nouveautés)
    this.route.queryParams.subscribe((params) => {
      if (params['q']) {
        this.searchQuery = params['q'];
      }
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['filter'] === 'nouveau') {
        this.selectedStatus = 'NOUVEAU';
      }
    });

    // Synchronisation du prix max
    setTimeout(() => {
      this.maxPrice = this.highestPrice();
    }, 400);
  }
}
