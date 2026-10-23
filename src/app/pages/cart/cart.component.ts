import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-stone-50/50 min-h-screen py-10 sm:py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <!-- En-tête Panier -->
        <div class="border-b border-stone-200 pb-6 mb-8 flex items-baseline justify-between">
          <div>
            <span class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">{{ ts.t('cart.selection') }}</span>
            <h1 class="font-serif text-3xl sm:text-4xl font-light text-stone-900 mt-1">
              {{ ts.t('cart.title') }}
            </h1>
          </div>
          @if (!cartService.isEmpty()) {
            <button
              type="button"
              (click)="cartService.clearCart()"
              class="text-xs text-rose-600 hover:text-rose-800 font-medium underline"
            >
              {{ ts.t('cart.clear') }}
            </button>
          }
        </div>

        @if (cartService.isEmpty()) {
          <!-- Panier Vide -->
          <div class="rounded-3xl border border-stone-200 bg-white p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm">
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-stone-400 mb-6">
              <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 class="font-serif text-2xl sm:text-3xl font-medium text-stone-900">{{ ts.t('cart.empty_title') }}</h2>
            <p class="text-xs sm:text-sm text-stone-500 font-light mt-3 leading-relaxed">
              {{ ts.t('cart.empty_desc') }}
            </p>
            <div class="mt-8">
              <a
                routerLink="/catalog"
                class="inline-flex rounded-full bg-stone-900 px-8 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white hover:bg-stone-800 shadow-lg transition-all"
              >
                {{ ts.t('cart.discover') }}
              </a>
            </div>
          </div>
        } @else {
          <!-- Grille Panier Plein -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">

            <!-- Colonne Gauche : Liste des Articles (8 cols) -->
            <div class="lg:col-span-8 space-y-6">

              <!-- Jauge Livraison Offerte -->
              <div class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
                <div class="flex items-center justify-between text-xs sm:text-sm">
                  @if (cartService.freeShippingRemaining() === 0) {
                    <div class="flex items-center gap-2 text-emerald-700 font-semibold">
                      <span>🎉</span>
                      <span>Félicitations ! La livraison standard vous est offerte.</span>
                    </div>
                  } @else {
                    <div class="text-stone-700 font-medium">
                      Plus que <span class="font-bold text-amber-900">{{ cartService.freeShippingRemaining().toFixed(2) }} €</span> pour bénéficier de la <span class="font-semibold">livraison offerte</span> !
                    </div>
                  }
                  <span class="text-xs text-stone-400 font-medium">{{ cartService.subtotal().toFixed(2) }}€ / {{ cartService.FREE_SHIPPING_THRESHOLD }}€</span>
                </div>

                <!-- Barre de progression -->
                <div class="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    class="h-full bg-gradient-to-r from-amber-600 to-emerald-600 transition-all duration-500 rounded-full"
                    [style.width.%]="cartService.freeShippingProgress()"
                  ></div>
                </div>
              </div>

              <!-- Tableau / Liste des Soins -->
              <div class="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden divide-y divide-stone-100">
                @for (item of cartService.items(); track item.product.id) {
                  <div class="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <!-- Visuel & Titre -->
                    <div class="flex items-center gap-4">
                      <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                        <img
                          [src]="productService.getProductImageUrl(item.product)"
                          [alt]="item.product.name"
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div class="space-y-1">
                        <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                          {{ item.product.brand }}
                        </span>
                        <h4 class="text-sm sm:text-base font-medium text-stone-900 hover:text-amber-900 transition-colors">
                          <a [routerLink]="['/product', item.product.id]">
                            {{ item.product.name }}
                          </a>
                        </h4>
                        <div class="text-xs text-stone-500">
                          Prix unitaire : <span class="font-semibold text-stone-800">{{ item.product.price.toFixed(2) }} €</span>
                        </div>
                      </div>
                    </div>

                    <!-- Contrôles Quantité & Total Ligne -->
                    <div class="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">

                      <!-- Stepper -->
                      <div class="flex items-center rounded-xl border border-stone-200 bg-stone-50 px-2 py-1">
                        <button
                          type="button"
                          (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)"
                          class="h-7 w-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                          aria-label="Diminuer la quantité"
                        >
                          –
                        </button>
                        <span class="w-8 text-center text-xs font-semibold text-stone-900">{{ item.quantity }}</span>
                        <button
                          type="button"
                          (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)"
                          [disabled]="item.product.stock ? item.quantity >= item.product.stock : false"
                          class="h-7 w-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white disabled:opacity-30 transition-colors"
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>

                      <!-- Sous-total Ligne -->
                      <div class="text-right min-w-[70px]">
                        <span class="text-sm sm:text-base font-semibold text-stone-900">
                          {{ (item.product.price * item.quantity).toFixed(2) }} €
                        </span>
                      </div>

                      <!-- Supprimer -->
                      <button
                        type="button"
                        (click)="cartService.removeFromCart(item.product.id)"
                        class="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Supprimer cet article"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                    </div>

                  </div>
                }
              </div>

              <!-- Poursuivre les achats -->
              <div class="pt-2">
                <a
                  routerLink="/catalog"
                  class="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors"
                >
                  <svg class="h-4 w-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>{{ ts.t('common.back') }}</span>
                </a>
              </div>

            </div>

            <!-- Colonne Droite : Récapitulatif Commande (4 cols) -->
            <div class="lg:col-span-4">
              <div class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-6 sticky top-28">

                <h3 class="font-serif text-xl font-medium text-stone-900 pb-3 border-b border-stone-100">
                  {{ ts.t('cart.summary') }}
                </h3>

                <!-- Lignes de calcul -->
                <div class="space-y-3 text-xs sm:text-sm text-stone-600">
                  <div class="flex justify-between">
                    <span>{{ ts.t('common.subtotal') }} ({{ cartService.totalCount() }})</span>
                    <span class="font-semibold text-stone-900">{{ cartService.subtotal().toFixed(2) }} €</span>
                  </div>

                  <div class="flex justify-between items-center">
                    <span>{{ ts.t('common.shipping') }}</span>
                    @if (cartService.shippingFee() === 0) {
                      <span class="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
                        {{ ts.t('common.shipping_free') }}
                      </span>
                    } @else {
                      <span class="font-semibold text-stone-900">{{ cartService.shippingFee().toFixed(2) }} €</span>
                    }
                  </div>
                </div>

                <!-- Total Final -->
                <div class="pt-4 border-t border-stone-200 flex justify-between items-baseline">
                  <span class="text-base font-semibold text-stone-900">{{ ts.t('common.total') }}</span>
                  <span class="text-2xl font-bold text-stone-900">{{ cartService.total().toFixed(2) }} €</span>
                </div>

                <!-- Bouton Passer la commande -->
                <a
                  routerLink="/checkout"
                  class="block w-full text-center rounded-xl bg-stone-900 py-3.5 px-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-xl hover:bg-stone-800 transition-all active:scale-95"
                >
                  {{ ts.t('cart.checkout_btn') }}
                </a>

                <!-- Réassurance -->
                <div class="pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-600">💵</span>
                    <span class="font-medium text-stone-700">{{ ts.t('checkout.payment_cod') }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-amber-700">🚚</span>
                    <span>{{ ts.t('cart.delivery_notice') }}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        }

      </div>
    </div>
  `
})
export class CartComponent {
  readonly ts = inject(TranslationService);
  readonly cartService = inject(CartService);
  readonly productService = inject(ProductService);
}
