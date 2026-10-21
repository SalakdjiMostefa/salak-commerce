import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { ProductDTO } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="bg-stone-50/40 min-h-screen py-8 sm:py-12">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <!-- Fil d'Ariane (Breadcrumb) -->
        <nav class="mb-8 flex items-center space-x-2 text-xs text-stone-500 font-light">
          <a routerLink="/" class="hover:text-stone-900 transition-colors">Accueil</a>
          <span>/</span>
          <a routerLink="/catalog" class="hover:text-stone-900 transition-colors">Catalogue</a>
          <span>/</span>
          <span class="text-stone-900 font-medium truncate max-w-xs sm:max-w-md">
            {{ product()?.name || 'Détail du Soin' }}
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

                  <!-- Badges Statut -->
                  <div class="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
                    @switch (product()!.status) {
                      @case ('NOUVEAU') {
                        <span class="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 shadow-sm">
                          ✦ Nouveauté Exclusive
                        </span>
                      }
                      @case ('RUPTURE') {
                        <span class="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20 shadow-sm">
                          Épuisé
                        </span>
                      }
                    }
                  </div>

                  <!-- Bouton Favori Flottant -->
                  <button
                    type="button"
                    (click)="toggleFavorite()"
                    class="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95"
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
                        class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all"
                        [ngClass]="activeImage() === img ? 'border-stone-900 ring-2 ring-stone-900/20 scale-95' : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'"
                      >
                        <img [src]="img" [alt]="product()!.name" class="h-full w-full object-cover" />
                      </button>
                    }
                  </div>
                }
              </div>

              <!-- COLONNE DROITE : INFORMATIONS & ACHAT -->
              <div class="lg:col-span-6 flex flex-col space-y-6">

                <!-- Marque & Note -->
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold uppercase tracking-[0.25em] text-amber-800">
                    {{ product()!.brand || 'Maison AURA' }}
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
                    <span class="text-xs text-stone-400">(48 avis)</span>
                  </div>
                </div>

                <!-- Titre du Soin -->
                <h1 class="font-serif text-3xl sm:text-4xl font-normal text-stone-900 leading-tight">
                  {{ product()!.name }}
                </h1>

                <!-- Prix -->
                <div class="flex items-baseline gap-3">
                  <span class="text-3xl font-semibold text-stone-900">
                    {{ product()!.price.toFixed(2) }} €
                  </span>
                  <span class="text-xs text-stone-400 font-light">TVA incluse</span>
                </div>

                <!-- Disponibilité & Stock -->
                <div class="flex items-center gap-2 text-xs">
                  @if (product()!.status === 'RUPTURE' || product()!.stock === 0) {
                    <span class="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                    <span class="font-medium text-rose-700">Momentanément indisponible</span>
                  } @else if (product()!.stock <= 5) {
                    <span class="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span class="font-medium text-amber-700">Stock très limité : plus que {{ product()!.stock }} unités</span>
                  } @else {
                    <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                    <span class="font-medium text-emerald-700">En stock ({{ product()!.stock }} exemplaires disponibles)</span>
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
                    <div class="flex items-center justify-between rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 w-full sm:w-36">
                      <button
                        type="button"
                        (click)="decrementQuantity()"
                        [disabled]="quantity() <= 1"
                        class="h-8 w-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white disabled:opacity-40 transition-colors"
                      >
                        –
                      </button>
                      <span class="text-sm font-semibold text-stone-900">{{ quantity() }}</span>
                      <button
                        type="button"
                        (click)="incrementQuantity()"
                        [disabled]="quantity() >= (product()!.stock || 99)"
                        class="h-8 w-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white disabled:opacity-40 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <!-- Bouton Ajouter au Panier -->
                    <button
                      type="button"
                      (click)="addToCart()"
                      [disabled]="product()!.status === 'RUPTURE' || product()!.stock === 0"
                      class="flex-1 rounded-xl py-3.5 px-8 text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                      [ngClass]="{
                        'bg-stone-900 text-white hover:bg-stone-800 active:scale-95': product()!.status !== 'RUPTURE' && product()!.stock > 0 && !addedSuccess(),
                        'bg-emerald-600 text-white': addedSuccess(),
                        'bg-stone-200 text-stone-400 cursor-not-allowed': product()!.status === 'RUPTURE' || product()!.stock === 0
                      }"
                    >
                      @if (addedSuccess()) {
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Ajouté avec succès !</span>
                      } @else if (product()!.status === 'RUPTURE' || product()!.stock === 0) {
                        <span>Produit Épuisé</span>
                      } @else {
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>Ajouter au rituel ({{ (product()!.price * quantity()).toFixed(2) }} €)</span>
                      }
                    </button>
                  </div>

                  <!-- Lien d'accès direct au panier après ajout -->
                  @if (addedSuccess()) {
                    <div class="text-center sm:text-left">
                      <a routerLink="/cart" class="text-xs font-semibold text-amber-900 underline hover:text-amber-700">
                        → Voir mon panier et finaliser ma commande
                      </a>
                    </div>
                  }
                </div>

                <!-- Réassurance Fiche Produit -->
                <div class="rounded-2xl bg-stone-50/80 p-4 border border-stone-200/60 space-y-2.5 text-xs text-stone-600">
                  <div class="flex items-center gap-2.5">
                    <span class="text-amber-800 font-bold">✓</span>
                    <span>Livraison offerte en France métropolitaine dès 50€ d'achat</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="text-amber-800 font-bold">✓</span>
                    <span>Flacon en verre recyclable & formule naturelle 98.7%</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="text-amber-800 font-bold">✓</span>
                    <span>Retours gratuits sous 14 jours si non ouvert</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          <!-- PRODUITS COMPLÉMENTAIRES / RECOMMANDATIONS -->
          @if (relatedProducts().length > 0) {
            <div class="mt-16">
              <div class="mb-8">
                <span class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Complétez Votre Rituel</span>
                <h2 class="font-serif text-2xl sm:text-3xl font-normal text-stone-900 mt-1">
                  Soins Associés & Complémentaires
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
            <h2 class="font-serif text-2xl font-medium text-stone-900">Produit introuvable</h2>
            <p class="text-sm text-stone-500 mt-2">Le soin que vous recherchez n'existe pas ou a été retiré.</p>
            <div class="mt-6">
              <a
                routerLink="/catalog"
                class="rounded-full bg-stone-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-stone-800"
              >
                Retourner au catalogue
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

  readonly product = signal<ProductDTO | null>(null);
  readonly loading = signal<boolean>(true);
  readonly quantity = signal<number>(1);
  readonly addedSuccess = signal<boolean>(false);
  readonly activeImage = signal<string>('');

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
        this.quantity.set(1);
        this.loading.set(false);
      },
      error: () => {
        // Fallback: chercher dans les produits déjà chargés
        const existing = this.productService.products().find((p) => p.id === id);
        if (existing) {
          this.product.set(existing);
          this.activeImage.set(this.productService.getProductImageUrl(existing));
        }
        this.loading.set(false);
      }
    });
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
    const max = this.product()?.stock || 99;
    if (this.quantity() < max) {
      this.quantity.update((q) => q + 1);
    }
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart(): void {
    const prod = this.product();
    if (!prod || prod.status === 'RUPTURE' || prod.stock === 0) return;

    this.cartService.addToCart(prod, this.quantity());
    this.addedSuccess.set(true);
    setTimeout(() => {
      this.addedSuccess.set(false);
    }, 2500);
  }
}
