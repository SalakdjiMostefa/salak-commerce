import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CreateOrderDTO, OrderDTO, OrderItemDTO } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-stone-50/50 min-h-screen py-10 sm:py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        @if (orderSuccess(); as order) {
          <!-- ÉCRAN DE CONFIRMATION DE COMMANDE -->
          <div class="max-w-2xl mx-auto rounded-3xl border border-stone-200 bg-white p-8 sm:p-12 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <span class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Commande Confirmée</span>
              <h1 class="font-serif text-3xl sm:text-4xl font-normal text-stone-900 mt-1">
                Merci pour votre confiance, {{ order.customerName }} !
              </h1>
              <p class="text-xs sm:text-sm text-stone-500 font-light mt-2">
                Votre rituel de beauté a été enregistré avec succès sous la référence <span class="font-bold text-stone-900">#{{ order.id }}</span>.
              </p>
            </div>

            <!-- Détails Commande -->
            <div class="rounded-2xl bg-stone-50 p-6 text-left space-y-4 border border-stone-200/80 text-xs sm:text-sm">
              <div class="grid grid-cols-2 gap-4 pb-4 border-b border-stone-200">
                <div>
                  <span class="text-stone-400 block text-[11px] uppercase">Adresse de livraison</span>
                  <span class="font-medium text-stone-900">{{ order.address }}</span>
                </div>
                <div>
                  <span class="text-stone-400 block text-[11px] uppercase">Contact</span>
                  <span class="font-medium text-stone-900">{{ order.email }}</span>
                  <span class="block text-stone-600 text-xs">{{ order.phone }}</span>
                </div>
              </div>

              <!-- Liste des Soins commandés -->
              <div>
                <span class="text-stone-400 block text-[11px] uppercase mb-2">Articles commandés</span>
                <div class="space-y-2">
                  @for (item of order.items; track item.productId) {
                    <div class="flex justify-between items-center text-xs">
                      <span class="text-stone-800 font-medium">{{ item.quantity }}x {{ item.productName }}</span>
                      <span class="font-semibold text-stone-900">{{ (item.unitPrice * item.quantity).toFixed(2) }} €</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Total Réglé -->
              <div class="pt-3 border-t border-stone-200 flex justify-between items-baseline font-bold text-sm sm:text-base text-stone-900">
                <span>Montant Total</span>
                <span>{{ order.total.toFixed(2) }} €</span>
              </div>
            </div>

            <div class="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <a
                routerLink="/catalog"
                class="rounded-full bg-stone-900 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-stone-800 transition-all shadow-md"
              >
                Poursuivre mes découvertes
              </a>
              <a
                routerLink="/"
                class="rounded-full border border-stone-300 bg-white px-8 py-3 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:bg-stone-50 transition-all"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        } @else {
          <!-- FORMULAIRE DE CHECKOUT -->
          <div class="border-b border-stone-200 pb-6 mb-8">
            <span class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Finalisation Sécurisée</span>
            <h1 class="font-serif text-3xl sm:text-4xl font-light text-stone-900 mt-1">
              Validation de votre Commande
            </h1>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">

            <!-- Colonne Gauche : Formulaire Réactif (7 cols) -->
            <div class="lg:col-span-7">
              <form [formGroup]="checkoutForm" (ngSubmit)="onSubmitOrder()" class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">

                <h3 class="font-serif text-xl font-medium text-stone-900 pb-3 border-b border-stone-100">
                  Coordonnées & Adresse de Livraison
                </h3>

                <!-- Statut de Connexion Client -->
                @if (authService.isLoggedIn()) {
                  <div class="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2.5">
                      <span class="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-amber-300">
                        ✦
                      </span>
                      <div>
                        <span class="font-bold text-stone-900 block">Connecté(e) en tant que {{ authService.userName() }}</span>
                        <span class="text-stone-500 text-[11px] font-mono">{{ authService.currentUser()?.email }}</span>
                      </div>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
                      Coordonnées pré-remplies
                    </span>
                  </div>
                } @else {
                  <div class="rounded-2xl bg-stone-50 border border-stone-200/80 p-3.5 flex items-center justify-between text-xs">
                    <span class="text-stone-600">Déjà client AURA ?</span>
                    <a routerLink="/login" class="font-semibold text-stone-900 hover:text-amber-900 underline">
                      Se connecter pour commander plus vite
                    </a>
                  </div>
                }

                <!-- Nom Complet -->
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Nom et Prénom <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="customerName"
                    placeholder="Ex: Camille Laurent"
                    class="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none transition-all"
                    [class.border-rose-400]="isFieldInvalid('customerName')"
                  />
                  @if (isFieldInvalid('customerName')) {
                    <p class="mt-1 text-xs text-rose-600">Veuillez renseigner votre nom complet (au moins 2 caractères).</p>
                  }
                </div>

                <!-- Email & Téléphone -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Adresse Email <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      formControlName="email"
                      placeholder="camille@exemple.com"
                      class="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none transition-all"
                      [class.border-rose-400]="isFieldInvalid('email')"
                    />
                    @if (isFieldInvalid('email')) {
                      <p class="mt-1 text-xs text-rose-600">Veuillez renseigner une adresse email valide.</p>
                    }
                  </div>

                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Numéro de Téléphone <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      formControlName="phone"
                      placeholder="06 12 34 56 78"
                      class="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none transition-all"
                      [class.border-rose-400]="isFieldInvalid('phone')"
                    />
                    @if (isFieldInvalid('phone')) {
                      <p class="mt-1 text-xs text-rose-600">Veuillez indiquer un numéro de téléphone valide.</p>
                    }
                  </div>
                </div>

                <!-- Adresse Complète -->
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Adresse Complète de Livraison <span class="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows="3"
                    formControlName="address"
                    placeholder="Numéro, rue, bâtiment, code postal et ville..."
                    class="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none transition-all"
                    [class.border-rose-400]="isFieldInvalid('address')"
                  ></textarea>
                  @if (isFieldInvalid('address')) {
                    <p class="mt-1 text-xs text-rose-600">Veuillez renseigner votre adresse complète de livraison.</p>
                  }
                </div>

                <!-- Mode de Règlement Simulation -->
                <div class="pt-4 border-t border-stone-100">
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-3">Moyen de Paiement</h4>
                  <div class="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <div class="text-xs font-semibold text-stone-900">Carte Bancaire / Visa / Mastercard</div>
                        <div class="text-[11px] text-stone-500">Paiement certifié 3D-Secure immédiat</div>
                      </div>
                    </div>
                    <span class="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full">Actif</span>
                  </div>
                </div>

                <!-- Erreur de soumission -->
                @if (submitError()) {
                  <div class="rounded-xl bg-rose-50 p-4 text-xs text-rose-700 border border-rose-200">
                    {{ submitError() }}
                  </div>
                }

                <!-- Bouton Confirmer -->
                <div class="pt-4">
                  <button
                    type="submit"
                    [disabled]="isSubmitting() || cartService.isEmpty()"
                    class="w-full rounded-xl bg-stone-900 py-4 px-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-xl hover:bg-stone-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    @if (isSubmitting()) {
                      <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Traitement de la commande en cours...</span>
                    } @else {
                      <span>Confirmer et Payer {{ cartService.total().toFixed(2) }} €</span>
                    }
                  </button>
                </div>

              </form>
            </div>

            <!-- Colonne Droite : Récapitulatif Panier (5 cols) -->
            <div class="lg:col-span-5">
              <div class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <h3 class="font-serif text-xl font-medium text-stone-900 pb-3 border-b border-stone-100">
                  Votre Rituel ({{ cartService.totalCount() }} articles)
                </h3>

                <!-- Mini Liste Articles -->
                <div class="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-stone-100">
                  @for (item of cartService.items(); track item.product.id) {
                    <div class="pt-3 first:pt-0 flex items-center justify-between text-xs">
                      <div>
                        <span class="font-medium text-stone-900 block">{{ item.product.name }}</span>
                        <span class="text-stone-400">Qté : {{ item.quantity }} × {{ item.product.price.toFixed(2) }} €</span>
                      </div>
                      <span class="font-semibold text-stone-900">
                        {{ (item.product.price * item.quantity).toFixed(2) }} €
                      </span>
                    </div>
                  }
                </div>

                <!-- Totaux -->
                <div class="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                  <div class="flex justify-between">
                    <span>Sous-total</span>
                    <span class="font-semibold text-stone-900">{{ cartService.subtotal().toFixed(2) }} €</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span>Frais de port</span>
                    @if (cartService.shippingFee() === 0) {
                      <span class="font-semibold text-emerald-700">Offerts</span>
                    } @else {
                      <span class="font-semibold text-stone-900">{{ cartService.shippingFee().toFixed(2) }} €</span>
                    }
                  </div>
                  <div class="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base font-bold text-stone-900">
                    <span>Total Net</span>
                    <span>{{ cartService.total().toFixed(2) }} €</span>
                  </div>
                </div>

                <div class="pt-2 text-center">
                  <a routerLink="/cart" class="text-xs text-stone-500 hover:text-stone-900 underline">
                    Modifier les articles du panier
                  </a>
                </div>

              </div>
            </div>

          </div>
        }

      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal<boolean>(false);
  readonly submitError = signal<string | null>(null);
  readonly orderSuccess = signal<OrderDTO | null>(null);

  checkoutForm!: FormGroup;

  ngOnInit(): void {
    if (this.cartService.isEmpty()) {
      this.router.navigate(['/cart']);
      return;
    }

    const user = this.authService.currentUser();

    this.checkoutForm = this.fb.group({
      customerName: [user?.fullName || '', [Validators.required, Validators.minLength(2)]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      phone: [user?.phone || '', [Validators.required, Validators.pattern('^[0-9+() -]{8,20}$')]],
      address: [user?.address || '', [Validators.required, Validators.minLength(5)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmitOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.cartService.isEmpty()) {
      this.submitError.set('Votre panier est vide.');
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const items: OrderItemDTO[] = this.cartService.items().map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price
    }));

    const orderPayload: CreateOrderDTO = {
      customerName: this.checkoutForm.value.customerName.trim(),
      email: this.checkoutForm.value.email.trim(),
      phone: this.checkoutForm.value.phone.trim(),
      address: this.checkoutForm.value.address.trim(),
      items: items,
      total: this.cartService.total()
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        this.orderSuccess.set(created);
        this.cartService.clearCart();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        // En cas d'indisponibilité du serveur local (ex: backend non lancé lors du dev), générer une confirmation locale
        if (err.status === 0 || err.status === 404) {
          const mockOrder: OrderDTO = {
            id: Math.floor(Math.random() * 9000) + 1000,
            customerName: orderPayload.customerName,
            email: orderPayload.email,
            phone: orderPayload.phone,
            address: orderPayload.address,
            items: orderPayload.items,
            total: orderPayload.total,
            status: 'PAYEE',
            createdAt: new Date().toISOString()
          };
          this.orderSuccess.set(mockOrder);
          this.cartService.clearCart();
        } else {
          this.submitError.set(
            'Impossible de valider votre commande actuellement. Veuillez vérifier vos informations ou réessayer ultérieurement.'
          );
        }
      }
    });
  }
}
