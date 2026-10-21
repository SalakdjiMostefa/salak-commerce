import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductDTO } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-stone-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <!-- Image & Badges Container -->
      <div class="relative aspect-square w-full overflow-hidden bg-stone-100/60">
        <!-- Badge Statut -->
        <div class="absolute left-3 top-3 z-10 flex flex-col gap-1">
          @switch (product.status) {
            @case ('NOUVEAU') {
              <span class="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 shadow-sm backdrop-blur-sm">
                ✦ Nouveauté
              </span>
            }
            @case ('RUPTURE') {
              <span class="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20 shadow-sm backdrop-blur-sm">
                Épuisé
              </span>
            }
            @case ('EN_STOCK') {
              @if (product.stock <= 5 && product.stock > 0) {
                <span class="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20 shadow-sm backdrop-blur-sm">
                  Plus que {{ product.stock }} en stock
                </span>
              }
            }
          }
        </div>

        <!-- Bouton Favori -->
        <button
          type="button"
          (click)="onToggleFavorite($event)"
          [attr.aria-label]="isFavorite() ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-600 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
          [class.text-rose-600]="isFavorite()"
        >
          <svg
            class="h-5 w-5 transition-transform"
            [class.scale-110]="isFavorite()"
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

        <!-- Image Produit avec zoom doux -->
        <a [routerLink]="['/product', product.id]" class="block h-full w-full">
          <img
            [src]="productService.getProductImageUrl(product)"
            [alt]="product.name"
            loading="lazy"
            class="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </a>

        <!-- Bouton Rapide d'Ajout sur Hover (Desktop) -->
        <div class="absolute inset-x-3 bottom-3 z-10 hidden sm:flex translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            (click)="onAddToCart($event)"
            [disabled]="product.status === 'RUPTURE' || product.stock === 0"
            class="w-full rounded-xl py-2.5 px-4 text-xs font-semibold tracking-wide uppercase shadow-lg transition-all flex items-center justify-center gap-2"
            [ngClass]="{
              'bg-stone-900 text-white hover:bg-stone-800 active:scale-95': product.status !== 'RUPTURE' && product.stock > 0 && !addedAnimation(),
              'bg-emerald-600 text-white': addedAnimation(),
              'bg-stone-300 text-stone-500 cursor-not-allowed': product.status === 'RUPTURE' || product.stock === 0
            }"
          >
            @if (addedAnimation()) {
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Ajouté au panier</span>
            } @else if (product.status === 'RUPTURE' || product.stock === 0) {
              <span>Indisponible</span>
            } @else {
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Ajout rapide</span>
            }
          </button>
        </div>
      </div>

      <!-- Informations Produit -->
      <div class="flex flex-1 flex-col p-4 sm:p-5">
        <!-- Marque & Note -->
        <div class="mb-1 flex items-center justify-between text-xs text-stone-500">
          <span class="font-medium tracking-wider uppercase text-stone-400 text-[11px]">{{ product.brand }}</span>
          @if (product.rating > 0) {
            <div class="flex items-center gap-1 text-amber-500">
              <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="font-semibold text-stone-700">{{ product.rating.toFixed(1) }}</span>
            </div>
          }
        </div>

        <!-- Titre du Produit -->
        <h3 class="mb-1 text-sm sm:text-base font-medium text-stone-900 group-hover:text-rose-950 transition-colors line-clamp-1">
          <a [routerLink]="['/product', product.id]">
            {{ product.name }}
          </a>
        </h3>

        <!-- Description courte -->
        <p class="mb-3 text-xs text-stone-500 line-clamp-2 leading-relaxed">
          {{ product.description }}
        </p>

        <!-- Prix & Bouton Mobile -->
        <div class="mt-auto flex items-center justify-between pt-2 border-t border-stone-100">
          <div>
            <span class="text-base sm:text-lg font-semibold text-stone-900">
              {{ product.price.toFixed(2) }} €
            </span>
          </div>

          <!-- Bouton Ajout Panier Mobile (visible uniquement < 640px) -->
          <button
            type="button"
            (click)="onAddToCart($event)"
            [disabled]="product.status === 'RUPTURE' || product.stock === 0"
            class="flex sm:hidden h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white transition-all active:scale-95 disabled:bg-stone-200 disabled:text-stone-400"
            aria-label="Ajouter au panier"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductDTO;

  readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly favoriteService = inject(FavoriteService);

  readonly addedAnimation = signal<boolean>(false);

  isFavorite(): boolean {
    return this.favoriteService.isFavorite(this.product.id);
  }

  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favoriteService.toggleFavorite(this.product);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.product.status === 'RUPTURE' || this.product.stock === 0) {
      return;
    }

    this.cartService.addToCart(this.product, 1);
    this.addedAnimation.set(true);
    setTimeout(() => {
      this.addedAnimation.set(false);
    }, 1500);
  }
}
