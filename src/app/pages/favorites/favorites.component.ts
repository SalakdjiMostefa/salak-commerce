import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="bg-stone-50/50 min-h-screen py-10 sm:py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <!-- En-tête -->
        <div class="border-b border-stone-200 pb-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-800">{{ ts.t('favorites.badge') }}</span>
            <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 mt-1">
              {{ ts.t('favorites.title') }}
            </h1>
            <p class="text-xs sm:text-sm text-stone-500 font-light mt-2">
              {{ ts.t('favorites.subtitle') }}
            </p>
          </div>

          @if (!favoriteService.isEmpty()) {
            <div class="flex items-center gap-3">
              <span class="text-xs text-stone-500 font-medium">
                {{ ts.t('favorites.saved_count', { count: favoriteService.count() }) }}
              </span>
              <button
                type="button"
                (click)="favoriteService.clearFavorites()"
                class="rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-rose-700 hover:border-rose-300 transition-colors"
              >
                {{ ts.t('favorites.clear') }}
              </button>
            </div>
          }
        </div>

        <!-- Contenu -->
        @if (favoriteService.isEmpty()) {
          <!-- Empty State -->
          <div class="rounded-3xl border border-stone-200 bg-white p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm">
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-6">
              <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 class="font-serif text-2xl sm:text-3xl font-medium text-stone-900">{{ ts.t('favorites.empty_title') }}</h2>
            <p class="text-xs sm:text-sm text-stone-500 font-light mt-3 leading-relaxed">
              {{ ts.t('favorites.empty_desc') }}
            </p>
            <div class="mt-8">
              <a
                routerLink="/catalog"
                class="inline-flex rounded-full bg-stone-900 px-8 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white hover:bg-stone-800 shadow-lg transition-all"
              >
                {{ ts.t('favorites.explore_cta') }}
              </a>
            </div>
          </div>
        } @else {
          <!-- Grille des Favoris -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (product of favoriteService.favorites(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        }

      </div>
    </div>
  `
})
export class FavoritesComponent {
  readonly favoriteService = inject(FavoriteService);
  readonly cartService = inject(CartService);
  readonly ts = inject(TranslationService);
}
