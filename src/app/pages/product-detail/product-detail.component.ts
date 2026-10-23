import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { ProductDTO } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="bg-stone-50/40 min-h-screen py-8 sm:py-12">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <!-- Fil d'Ariane (Breadcrumb) -->
        <nav class="mb-8 flex items-center space-x-2 text-xs text-stone-500 font-light rtl:space-x-reverse">
          <a routerLink="/" class="hover:text-stone-900 transition-colors">{{ ts.t('detail.breadcrumb_home') }}</a>
          <span>/</span>
          <a routerLink="/catalog" class="hover:text-stone-900 transition-colors">{{ ts.t('detail.breadcrumb_catalog') }}</a>
          <span>/</span>
          <span class="text-stone-900 font-medium truncate max-w-xs sm:max-w-md">
            {{ product()?.name || ts.t('detail.breadcrumb_default') }}
          </span>
        </nav>

        <!-- Loading State -->
        @if (loading()) {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse bg-white p-8 rounded-3xl border border-stone-200">
            <div class="lg:col-span-6 aspect-square bg-stone-200 rounded-2xl"></div>
            <div class="lg:col-span-6 space-y-6">
              <div class="h-6 w-1/4 bg-stone-200 rounded"></div>
              <div class="h-10 w-3/4 bg-stone-200 rounded"></div>
              <div class="h-8 w-1/3 bg-stone-200 rounded"></div>
              <div class="h-24 w-full bg-stone-200 rounded"></div>
            </div>
          </div>
        } @else if (product()) {
          <!-- Fiche Produit Principale -->
          <div class="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-10 shadow-sm">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

              <!-- COLONNE GAUCHE : GALERIE D'IMAGES -->
              <div class="lg:col-span-6 space-y-4">
                <!-- Image Principale -->
                <div class="relative aspect-square w-full overflow-hidden rounded-2xl bg-stone-100 shadow-inner group">
                  <img
                    [src]="activeImage()"
                    [alt]="product()!.name"
                    class="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />

                  <!-- Badges Statut & Grossiste -->
                  <div class="absolute left-4 rtl:left-auto rtl:right-4 top-4 z-10 flex flex-col gap-1.5 items-start">
                    @if (isWholesaleProduct()) {
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-900 text-white px-3 py-1 text-xs font-bold shadow-md backdrop-blur-sm">
                        <span>✦</span> {{ ts.t('wholesale.badge') }}
                      </span>
                    }

                    @switch (product()!.status) {
                      @case ('NOUVEAU') {
                        <span class="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 shadow-sm">
                          {{ ts.t('detail.new_badge') }}
                        </span>
                      }
                      @case ('RUPTURE') {
                        <span class="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20 shadow-sm">
                          {{ ts.t('detail.out_of_stock_badge') }}
                        </span>
                      }
                    }
                  </div>

                  <!-- Bouton Favori Flottant -->
                  <button
                    type="button"
                    (click)="toggleFavorite()"
                    class="absolute right-4 rtl:right-auto rtl:left-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95"
                    [class.text-rose-600]="isFavorite()"
                    [attr.aria-label]="isFavorite() ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                  >
                    <svg
                      class="h-6 w-6"
                      [attr.fill]="isFavorite() ? 'currentColor' : 'none'"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.8"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Miniatures (Thumbnails) -->
                @if (galleryImages().length > 1) {
                  <div class="flex gap-3 overflow-x-auto pb-2">
                    @for (img of galleryImages(); track $index) {
                      <button
                        type="button"
                        (click)="activeImage.set(img)"
                        class="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all"
                        [class.border-stone-900]="activeImage() === img"
                        [class.border-transparent]="activeImage() !== img"
                      >
                        <img [src]="img" [alt]="product()!.name" class="h-full w-full object-cover" />
                      </button>
                    }
                  </div>
                }
              </div>

              <!-- COLONNE DROITE : DÉTAILS DU SOIN -->
              <div class="lg:col-span-6 space-y-6 text-left rtl:text-right">

                <!-- En-tête Marque & Note -->
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <span class="text-xs font-semibold tracking-widest uppercase text-amber-800">
                    {{ product()!.brand }}
                  </span>

                  <!-- Avis étoiles -->
                  <div class="flex items-center gap-1.5">
                    <div class="flex text-amber-500">
                      @for (s of [1, 2, 3, 4, 5]; track s) {
                        <svg
                          class="h-4 w-4"
                          [class.fill-current]="s <= (product()!.rating || 5)"
                          [class.text-stone-300]="s > (product()!.rating || 5)"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      }
                    </div>
                    <span class="text-xs font-semibold text-stone-800">{{ (product()!.rating || 5).toFixed(1) }}/5</span>
                    <span class="text-xs text-stone-400">{{ ts.t('detail.reviews_count', { count: 48 }) }}</span>
                  </div>
                </div>

                <!-- Titre du Soin -->
                <h1 class="font-serif text-3xl sm:text-4xl font-normal text-stone-900 leading-tight">
                  {{ product()!.name }}
                </h1>

                <!-- Bloc PRIX : Conditionnel selon statut Grossiste -->
                @if (isWholesaleProduct()) {
                  <!-- Bloc Tarif Professionnel Débloqué -->
                  <div class="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <span>✦</span> {{ ts.t('wholesale.badge') }}
                      </span>
                      <span class="text-xs text-stone-400 line-through">
                        {{ ts.t('wholesale.retail_price_label') }} {{ product()!.price.toFixed(2) }} €
                      </span>
                    </div>

                    <div class="flex items-baseline gap-3">
                      <span class="text-3xl sm:text-4xl font-bold text-amber-950 font-serif">
                        {{ product()!.wholesalePrice!.toFixed(2) }} €
                      </span>
                      <span class="text-xs text-stone-600 font-medium">{{ ts.t('wholesale.per_unit') }}</span>
                    </div>

                    <div class="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900 font-semibold">
                      <span>{{ ts.t('wholesale.carton_unit', { qty: product()!.wholesaleMinQty || 12 }) }}</span>
                      <span class="font-bold">
                        {{ ts.t('wholesale.carton_total', { total: (product()!.wholesalePrice! * (product()!.wholesaleMinQty || 12)).toFixed(2) }) }}
                      </span>
                    </div>
                  </div>
                } @else {
                  <!-- Bloc Prix Détail Public Normal -->
                  <div class="space-y-1">
                    <div class="flex items-baseline gap-3">
                      <span class="text-3xl font-semibold text-stone-900">
                        {{ product()!.price.toFixed(2) }} €
                      </span>
                      <span class="text-xs text-stone-400 font-light">{{ ts.t('detail.tax_included') }}</span>
                    </div>

                    <!-- Invitation discrète vers l'espace grossiste pour les visiteurs -->
                    <div class="pt-1">
                      <a routerLink="/wholesale-register" class="inline-flex items-center gap-1 text-xs text-amber-900/80 hover:text-amber-900 hover:underline font-medium transition-colors">
                        <span>{{ ts.t('wholesale.join_cta') }}</span>
                      </a>
                    </div>
                  </div>
                }

                <!-- Disponibilité & Stock -->
                <div class="flex items-center gap-2 text-xs">
                  @if (product()!.status === 'RUPTURE' || product()!.stock === 0) {
                    <span class="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                    <span class="font-medium text-rose-700">{{ ts.t('detail.out_of_stock') }}</span>
                  } @else if (product()!.stock <= 5) {
                    <span class="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span class="font-medium text-amber-700">{{ ts.t('detail.stock_limited', { count: product()!.stock }) }}</span>
                  } @else {
                    <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                    <span class="font-medium text-emerald-700">{{ ts.t('detail.in_stock', { count: product()!.stock }) }}</span>
                  }
                </div>

                <!-- Description -->
                <div class="border-t border-b border-stone-100 py-4">
                  <p class="text-sm text-stone-600 leading-relaxed font-light">
                    {{ product()!.description }}
                  </p>
                </div>

                <!-- Sélecteur de Quantité & Bouton Ajouter au Panier -->
                <div class="space-y-4 pt-2">
                  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

                    <!-- Quantité Stepper -->
                    <div class="flex items-center justify-between rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 w-full sm:w-44">
                      <button
                        type="button"
                        (click)="decrementQuantity()"
                        [disabled]="quantity() <= getStep()"
                        class="h-8 w-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white disabled:opacity-40 transition-colors font-bold"
                      >
                        –
                      </button>
                      <div class="text-center">
                        <span class="text-sm font-bold text-stone-900 block">{{ quantity() }}</span>
                        @if (isWholesaleProduct()) {
                          <span class="text-[9px] text-amber-800 font-semibold uppercase block">
                            {{ quantity() / getStep() }} carton(s)
                          </span>
                        }
                      </div>
                      <button
                        type="button"
                        (click)="incrementQuantity()"
                        [disabled]="quantity() + getStep() > (product()!.stock || 999)"
                        class="h-8 w-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white disabled:opacity-40 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>

                    <!-- Bouton Ajouter au Panier -->
                    <button
                      type="button"
                      (click)="addToCart()"
                      [disabled]="product()!.status === 'RUPTURE' || product()!.stock === 0"
                      class="flex-1 rounded-xl py-3.5 px-6 text-sm sm:text-base font-bold tracking-normal shadow-xl transition-all flex items-center justify-center gap-2 select-none"
                      [ngClass]="{
                        'bg-stone-900 text-white hover:bg-stone-800 active:scale-95': product()!.status !== 'RUPTURE' && product()!.stock > 0 && !addedSuccess(),
                        'bg-emerald-600 text-white shadow-emerald-900/30 ring-emerald-400/50': addedSuccess(),
                        'bg-gray-200 text-gray-500 font-semibold border border-gray-300 cursor-not-allowed': product()!.status === 'RUPTURE' || product()!.stock === 0
                      }"
                    >
                      @if (addedSuccess()) {
                        <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="text-white font-bold">{{ ts.t('detail.added_success') }}</span>
                      } @else if (product()!.status === 'RUPTURE' || product()!.stock === 0) {
                        <span class="text-stone-700 font-semibold">{{ ts.t('detail.out_of_stock_badge') }}</span>
                      } @else {
                        <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span class="text-white font-bold">
                          {{ ts.t('detail.add_to_cart_price', { total: getEffectiveTotal() }) }}
                        </span>
                      }
                    </button>
                  </div>

                  <!-- Lien d'accès direct au panier après ajout -->
                  @if (addedSuccess()) {
                    <div class="text-center sm:text-left rtl:sm:text-right pt-1">
                      <a routerLink="/cart" class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 underline hover:text-amber-700 transition-colors">
                        <span>{{ ts.t('detail.view_cart_cta') }}</span>
                      </a>
                    </div>
                  }
                </div>

                <!-- Réassurance Fiche Produit -->
                <div class="rounded-2xl bg-stone-50/80 p-4 border border-stone-200/60 space-y-2.5 text-xs text-stone-600">
                  <div class="flex items-center gap-2.5">
                    <span class="text-amber-800 font-bold">✓</span>
                    <span>{{ ts.t('detail.reassurance_1') }}</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="text-amber-800 font-bold">✓</span>
                    <span>{{ ts.t('detail.reassurance_2') }}</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="text-amber-800 font-bold">✓</span>
                    <span>{{ ts.t('detail.reassurance_3') }}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          <!-- PRODUITS COMPLÉMENTAIRES / RECOMMANDATIONS -->
          @if (relatedProducts().length > 0) {
            <div class="mt-16">
              <div class="mb-8">
                <span class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">{{ ts.t('detail.brand') }}</span>
                <h2 class="font-serif text-2xl sm:text-3xl font-normal text-stone-900 mt-1">
                  {{ ts.t('detail.related_title') }}
                </h2>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                @for (rel of relatedProducts(); track rel.id) {
                  <app-product-card [product]="rel" />
                }
              </div>
            </div>
          }
        } @else {
          <!-- Produit non trouvé -->
          <div class="rounded-3xl border border-stone-200 bg-white p-12 text-center">
            <h2 class="font-serif text-2xl font-medium text-stone-900">{{ ts.t('catalog.empty_title') }}</h2>
            <p class="text-sm text-stone-500 mt-2">{{ ts.t('catalog.empty_desc') }}</p>
            <div class="mt-6">
              <a
                routerLink="/catalog"
                class="rounded-full bg-stone-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-stone-800"
              >
                {{ ts.t('common.explore') }}
              </a>
            </div>
          </div>
        }

      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly favoriteService = inject(FavoriteService);
  readonly authService = inject(AuthService);
  readonly ts = inject(TranslationService);

  readonly product = signal<ProductDTO | null>(null);
  readonly loading = signal<boolean>(true);
  readonly quantity = signal<number>(1);
  readonly addedSuccess = signal<boolean>(false);
  readonly activeImage = signal<string>('');

  readonly isWholesaleProduct = computed(() => {
    const prod = this.product();
    return !!(this.authService.isWholesale() && prod && prod.wholesalePrice);
  });

  readonly galleryImages = computed(() => {
    const prod = this.product();
    if (!prod) return [];
    if (prod.images && prod.images.length > 0) {
      return prod.images.map((img) =>
        img.storedFileName.startsWith('http')
          ? img.storedFileName
          : `${this.productService.getProductImageUrl(prod)}`
      );
    }
    return [this.productService.getProductImageUrl(prod)];
  });

  readonly relatedProducts = computed(() => {
    const current = this.product();
    if (!current) return [];
    return this.productService
      .products()
      .filter((p) => p.id !== current.id)
      .slice(0, 4);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadProduct(id);
      }
    });

    if (this.productService.products().length === 0) {
      this.productService.loadProducts();
    }
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.product.set(prod);
        this.activeImage.set(this.productService.getProductImageUrl(prod));
        const initialQty = (this.authService.isWholesale() && prod?.wholesalePrice)
          ? (prod.wholesaleMinQty || 12)
          : 1;
        this.quantity.set(initialQty);
        this.loading.set(false);
      },
      error: () => {
        const existing = this.productService.products().find((p) => p.id === id);
        if (existing) {
          this.product.set(existing);
          this.activeImage.set(this.productService.getProductImageUrl(existing));
          const initialQty = (this.authService.isWholesale() && existing.wholesalePrice)
            ? (existing.wholesaleMinQty || 12)
            : 1;
          this.quantity.set(initialQty);
        }
        this.loading.set(false);
      }
    });
  }

  getStep(): number {
    if (this.isWholesaleProduct()) {
      return this.product()?.wholesaleMinQty || 12;
    }
    return 1;
  }

  getEffectiveTotal(): string {
    const prod = this.product();
    if (!prod) return '0.00';
    const unitPrice = this.isWholesaleProduct() ? prod.wholesalePrice! : prod.price;
    return (unitPrice * this.quantity()).toFixed(2);
  }

  isFavorite(): boolean {
    const prod = this.product();
    return prod ? this.favoriteService.isFavorite(prod.id) : false;
  }

  toggleFavorite(): void {
    const prod = this.product();
    if (prod) {
      this.favoriteService.toggleFavorite(prod);
    }
  }

  incrementQuantity(): void {
    const max = this.product()?.stock || 999;
    const step = this.getStep();
    if (this.quantity() + step <= max) {
      this.quantity.update((q) => q + step);
    }
  }

  decrementQuantity(): void {
    const step = this.getStep();
    if (this.quantity() - step >= step) {
      this.quantity.update((q) => q - step);
    }
  }

  addToCart(): void {
    const prod = this.product();
    if (!prod || prod.status === 'RUPTURE' || prod.stock === 0) return;

    const isWholesale = this.isWholesaleProduct();
    this.cartService.addToCart(prod, this.quantity(), isWholesale);
    this.addedSuccess.set(true);
    setTimeout(() => {
      this.addedSuccess.set(false);
    }, 2500);
  }
}
