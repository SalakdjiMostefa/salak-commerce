import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductDTO, ProductStatus } from '../../models/product.model';
import { TranslationService } from '../../services/translation.service';

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
              <span class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">SALAKOMERCE</span>
              <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 mt-1">
                {{ ts.t('catalog.title') }}
              </h1>
              <p class="text-xs sm:text-sm text-stone-500 font-light mt-2 max-w-2xl">
                {{ ts.t('catalog.subtitle') }}
              </p>
            </div>

            <!-- Compteur & Tri -->
            <div class="flex items-center gap-4 self-start md:self-end">
              <span class="text-xs text-stone-500 font-medium">
                {{ filteredProducts().length }} {{ ts.t('catalog.products_found') }}
              </span>

              <!-- Select Tri Réactif -->
              <div class="relative">
                <select
                  [value]="selectedSort()"
                  (change)="selectedSort.set($any($event.target).value)"
                  class="rounded-xl border border-stone-300 bg-white py-2 pl-3 pr-8 rtl:pl-8 rtl:pr-3 text-xs font-medium text-stone-700 shadow-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
                >
                  <option value="featured">{{ ts.t('catalog.sort_featured') }}</option>
                  <option value="price-asc">{{ ts.t('catalog.sort_price_asc') }}</option>
                  <option value="price-desc">{{ ts.t('catalog.sort_price_desc') }}</option>
                  <option value="name-asc">{{ ts.t('catalog.sort_name_asc') }}</option>
                </select>
              </div>

              <!-- Bouton Filtres Mobile Toggle -->
              <button
                type="button"
                (click)="mobileFiltersOpen.set(!mobileFiltersOpen())"
                class="lg:hidden flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-sm hover:bg-stone-50 active:scale-95 transition-all"
              >
                <svg class="h-4 w-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>{{ ts.t('catalog.filters_btn') }}</span>
                @if (hasActiveFilters()) {
                  <span class="h-2 w-2 rounded-full bg-amber-600 animate-pulse"></span>
                }
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <!-- SIDEBAR FILTRES (Desktop permanent + Mobile togglable) -->
          <aside
            class="space-y-6"
            [class.hidden]="!mobileFiltersOpen()"
            [class.block]="mobileFiltersOpen()"
            [ngClass]="{ 'lg:!block': true }"
          >
            <div class="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm space-y-6">

              <!-- En-tête Filtres + Bouton Effacer tout + Fermer Mobile -->
              <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                <div class="flex items-center gap-2">
                  <h3 class="font-serif text-lg font-medium text-stone-900">{{ ts.t('catalog.filters_title') }}</h3>
                  @if (hasActiveFilters()) {
                    <span class="h-2 w-2 rounded-full bg-amber-600"></span>
                  }
                </div>

                <div class="flex items-center gap-3">
                  @if (hasActiveFilters()) {
                    <button
                      type="button"
                      (click)="resetFilters()"
                      class="text-xs text-rose-600 hover:text-rose-800 font-medium underline transition-colors"
                    >
                      {{ ts.t('catalog.clear_all') }}
                    </button>
                  }

                  <!-- Bouton fermer la sidebar sur mobile -->
                  <button
                    type="button"
                    (click)="mobileFiltersOpen.set(false)"
                    class="lg:hidden text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                    aria-label="Fermer les filtres"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- 1. Recherche textuelle Réactive -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  {{ ts.t('catalog.search_label') }}
                </label>
                <div class="relative">
                  <input
                    type="text"
                    [value]="searchQuery()"
                    (input)="searchQuery.set($any($event.target).value)"
                    [placeholder]="ts.t('catalog.search_placeholder')"
                    class="w-full rounded-xl border border-stone-200 bg-stone-50/60 py-2 pl-8 pr-7 rtl:pl-7 rtl:pr-8 text-xs text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:bg-white focus:outline-none transition-all"
                  />
                  <svg class="absolute left-2.5 rtl:left-auto rtl:right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  @if (searchQuery()) {
                    <button
                      type="button"
                      (click)="searchQuery.set('')"
                      class="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs px-1"
                      aria-label="Effacer la recherche"
                    >
                      ✕
                    </button>
                  }
                </div>
              </div>

              <!-- 2. Filtre par Catégorie -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  {{ ts.t('catalog.categories_label') }}
                </label>
                <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    type="button"
                    (click)="selectedCategory.set('')"
                    class="w-full text-left rtl:text-right px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between"
                    [ngClass]="selectedCategory() === '' ? 'bg-stone-900 text-white font-medium shadow-sm' : 'text-stone-600 hover:bg-stone-100'"
                  >
                    <span>{{ ts.t('catalog.all_categories') }}</span>
                    <span class="text-[11px] opacity-80">{{ allProducts().length }}</span>
                  </button>
                  @for (cat of categories(); track cat.id) {
                    <button
                      type="button"
                      (click)="selectedCategory.set(cat.name)"
                      class="w-full text-left rtl:text-right px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between"
                      [ngClass]="isCategorySelected(cat.name) ? 'bg-stone-900 text-white font-medium shadow-sm' : 'text-stone-600 hover:bg-stone-100'"
                    >
                      <span>{{ cat.name }}</span>
                      <span class="text-[11px] opacity-80">({{ getCategoryProductCount(cat.name) }})</span>
                    </button>
                  }
                </div>
              </div>

              <!-- 3. Filtre par Marque -->
              @if (availableBrands().length > 0) {
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                    {{ ts.t('catalog.brand_label') }}
                  </label>
                  <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    <button
                      type="button"
                      (click)="selectedBrand.set('')"
                      class="w-full text-left rtl:text-right px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                      [ngClass]="selectedBrand() === '' ? 'bg-stone-900 text-white font-medium shadow-sm' : 'text-stone-600 hover:bg-stone-100'"
                    >
                      {{ ts.t('catalog.all_brands') }}
                    </button>
                    @for (b of availableBrands(); track b) {
                      <button
                        type="button"
                        (click)="selectedBrand.set(b)"
                        class="w-full text-left rtl:text-right px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                        [ngClass]="selectedBrand() === b ? 'bg-stone-900 text-white font-medium shadow-sm' : 'text-stone-600 hover:bg-stone-100'"
                      >
                        {{ b }}
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- 4. Filtre par Prix Max (Slider) -->
              <div>
                <div class="flex items-center justify-between text-xs mb-2">
                  <span class="font-semibold uppercase tracking-wider text-stone-600">{{ ts.t('catalog.max_price') }}</span>
                  <span class="font-bold text-stone-900 font-mono">{{ maxPrice() }} €</span>
                </div>
                <input
                  type="range"
                  min="10"
                  [max]="highestPrice()"
                  step="1"
                  [value]="maxPrice()"
                  (input)="maxPrice.set(+$any($event.target).value)"
                  class="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
                <div class="flex justify-between text-[11px] text-stone-400 mt-1 font-mono">
                  <span>10 €</span>
                  <span>{{ highestPrice() }} €</span>
                </div>
              </div>

              <!-- 5. Filtre par Note minimale -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  {{ ts.t('catalog.min_rating') }}
                </label>
                <div class="grid grid-cols-4 gap-1.5">
                  @for (star of [0, 3, 4, 4.5]; track star) {
                    <button
                      type="button"
                      (click)="minRating.set(star)"
                      class="py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer"
                      [ngClass]="minRating() === star ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-sm' : 'border-stone-200 text-stone-600 hover:bg-stone-50'"
                    >
                      {{ star === 0 ? ts.t('catalog.all_ratings') : star + '★+' }}
                    </button>
                  }
                </div>
              </div>

              <!-- 6. Filtre par Disponibilité / Statut -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  {{ ts.t('catalog.availability_label') }}
                </label>
                <div class="space-y-2">
                  <label class="flex items-center text-xs text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="statusFilter"
                      value=""
                      [checked]="selectedStatus() === ''"
                      (change)="selectedStatus.set('')"
                      class="h-3.5 w-3.5 text-stone-900 accent-stone-900 mr-2 rtl:mr-0 rtl:ml-2 cursor-pointer"
                    />
                    <span>{{ ts.t('catalog.all_status') }}</span>
                  </label>
                  <label class="flex items-center text-xs text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="statusFilter"
                      value="EN_STOCK"
                      [checked]="selectedStatus() === 'EN_STOCK'"
                      (change)="selectedStatus.set('EN_STOCK')"
                      class="h-3.5 w-3.5 text-stone-900 accent-stone-900 mr-2 rtl:mr-0 rtl:ml-2 cursor-pointer"
                    />
                    <span>{{ ts.t('catalog.in_stock_only') }}</span>
                  </label>
                  <label class="flex items-center text-xs text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="statusFilter"
                      value="NOUVEAU"
                      [checked]="selectedStatus() === 'NOUVEAU'"
                      (change)="selectedStatus.set('NOUVEAU')"
                      class="h-3.5 w-3.5 text-stone-900 accent-stone-900 mr-2 rtl:mr-0 rtl:ml-2 cursor-pointer"
                    />
                    <span>{{ ts.t('catalog.new_only') }}</span>
                  </label>
                </div>
              </div>

              <!-- Bouton Mobile : Appliquer et Fermer le Drawer -->
              <div class="lg:hidden pt-4 border-t border-stone-100">
                <button
                  type="button"
                  (click)="mobileFiltersOpen.set(false)"
                  class="w-full rounded-xl bg-stone-900 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-stone-800 transition-all text-center"
                >
                  Voir les soins ({{ filteredProducts().length }})
                </button>
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
                <h3 class="font-serif text-2xl font-medium text-stone-900 mt-4">{{ ts.t('catalog.empty_title') }}</h3>
                <p class="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto">
                  {{ ts.t('catalog.empty_desc') }}
                </p>
                <div class="mt-6">
                  <button
                    type="button"
                    (click)="resetFilters()"
                    class="rounded-full bg-stone-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-stone-800 transition-all shadow-md cursor-pointer"
                  >
                    {{ ts.t('catalog.reset_filters') }}
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
  readonly ts = inject(TranslationService);

  readonly allProducts = this.productService.products;
  readonly categories = this.categoryService.categories;

  // États réactifs avec Signals Angular pour déclenchement instantané
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('');
  readonly selectedBrand = signal<string>('');
  readonly selectedStatus = signal<string>('');
  readonly minRating = signal<number>(0);
  readonly maxPrice = signal<number>(500);
  readonly selectedSort = signal<string>('featured');
  readonly mobileFiltersOpen = signal<boolean>(false);

  // Plus haut prix disponible dans le catalogue
  readonly highestPrice = computed(() => {
    const list = this.allProducts();
    if (list.length === 0) return 300;
    const max = Math.max(...list.map((p) => p.price));
    return Math.ceil(max) || 300;
  });

  // Liste unique des marques disponibles
  readonly availableBrands = computed(() => {
    const list = this.allProducts();
    const brands = new Set<string>();
    list.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  });

  // Indicateur si des filtres sont actifs
  readonly hasActiveFilters = computed(() => {
    return (
      this.searchQuery().trim() !== '' ||
      this.selectedCategory() !== '' ||
      this.selectedBrand() !== '' ||
      this.selectedStatus() !== '' ||
      this.minRating() > 0 ||
      this.maxPrice() < this.highestPrice()
    );
  });

  // Filtrage et Tri en temps réel automatique via Signals
  readonly filteredProducts = computed(() => {
    let list = [...this.allProducts()];

    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory().toLowerCase().trim();
    const brand = this.selectedBrand().trim();
    const status = this.selectedStatus();
    const rating = this.minRating();
    const maxP = this.maxPrice();
    const sort = this.selectedSort();

    // 1. Recherche textuelle (nom, marque, description)
    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // 2. Filtre Catégorie
    if (cat) {
      list = list.filter((p) => {
        if (typeof p.category === 'object' && p.category !== null) {
          const catName = p.category.name ? p.category.name.toLowerCase().trim() : '';
          return catName === cat || String(p.category.id) === cat;
        }
        return String(p.category).toLowerCase().trim() === cat;
      });
    }

    // 3. Filtre Marque
    if (brand) {
      list = list.filter((p) => p.brand === brand);
    }

    // 4. Filtre Disponibilité / Statut
    if (status === 'EN_STOCK') {
      list = list.filter(
        (p) => (p.stock > 0 || p.status === 'EN_STOCK' || p.status === 'NOUVEAU') && p.status !== 'RUPTURE'
      );
    } else if (status === 'NOUVEAU') {
      list = list.filter((p) => p.status === 'NOUVEAU');
    }

    // 5. Filtre Prix Maximum
    if (maxP > 0) {
      list = list.filter((p) => p.price <= maxP);
    }

    // 6. Filtre Note Minimale
    if (rating > 0) {
      list = list.filter((p) => (p.rating || 0) >= rating);
    }

    // 7. Tri de la sélection
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        break;
      case 'featured':
      default:
        // Priorité aux nouveautés puis aux soins les mieux notés
        list.sort((a, b) => {
          if (a.status === 'NOUVEAU' && b.status !== 'NOUVEAU') return -1;
          if (b.status === 'NOUVEAU' && a.status !== 'NOUVEAU') return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
    }

    return list;
  });

  constructor() {
    // Aligner le curseur prix max avec la valeur réelle la plus haute dès que les produits sont chargés
    effect(() => {
      const highest = this.highestPrice();
      if (highest > 0 && (this.maxPrice() === 500 || this.maxPrice() > highest)) {
        this.maxPrice.set(highest);
      }
    });
  }

  isCategorySelected(catName: string): boolean {
    return this.selectedCategory().toLowerCase().trim() === catName.toLowerCase().trim();
  }

  getCategoryProductCount(catName: string): number {
    const target = catName.toLowerCase().trim();
    return this.allProducts().filter((p) => {
      if (typeof p.category === 'object' && p.category !== null) {
        return p.category.name && p.category.name.toLowerCase().trim() === target;
      }
      return String(p.category).toLowerCase().trim() === target;
    }).length;
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedBrand.set('');
    this.selectedStatus.set('');
    this.minRating.set(0);
    this.maxPrice.set(this.highestPrice());
    this.selectedSort.set('featured');
  }

  ngOnInit(): void {
    if (this.allProducts().length === 0) {
      this.productService.loadProducts();
    }
    if (this.categories().length === 0) {
      this.categoryService.loadCategories();
    }

    // Lecture des paramètres d'URL (recherche globale, filtre par catégorie depuis la home, nouveautés)
    this.route.queryParams.subscribe((params) => {
      if (params['q']) {
        this.searchQuery.set(params['q']);
      }
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      if (params['filter'] === 'nouveau') {
        this.selectedStatus.set('NOUVEAU');
      }
    });
  }
}
