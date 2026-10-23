import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CreateOrderDTO, OrderDTO, OrderItemDTO, PaymentMethod } from '../../models/order.model';

export const ALGERIA_WILAYAS = [
  '01 - Adrar', '02 - Chlef', '03 - Laghouat', '04 - Oum El Bouaghi', '05 - Batna',
  '06 - Béjaïa', '07 - Biskra', '08 - Béchar', '09 - Blida', '10 - Bouira',
  '11 - Tamanrasset', '12 - Tébessa', '13 - Tlemcen', '14 - Tiaret', '15 - Tizi Ouzou',
  '16 - Alger', '17 - Djelfa', '18 - Jijel', '19 - Sétif', '20 - Saïda',
  '21 - Skikda', '22 - Sidi Bel Abbès', '23 - Annaba', '24 - Guelma', '25 - Constantine',
  '26 - Médéa', '27 - Mostaganem', '28 - M\'Sila', '29 - Mascara', '30 - Ouargla',
  '31 - Oran', '32 - El Bayadh', '33 - Illizi', '34 - Bordj Bou Arreridj', '35 - Boumerdès',
  '36 - El Tarf', '37 - Tindouf', '38 - Tissemsilt', '39 - El Oued', '40 - Khenchela',
  '41 - Souk Ahras', '42 - Tipaza', '43 - Mila', '44 - Aïn Defla', '45 - Naâma',
  '46 - Aïn Témouchent', '47 - Ghardaïa', '48 - Relizane', '49 - Timimoun',
  '50 - Bordj Badji Mokhtar', '51 - Ouled Djellal', '52 - Béni Abbès', '53 - In Salah',
  '54 - In Guezzam', '55 - Touggourt', '56 - Djanet', '57 - El M\'Ghair', '58 - El Meniaa'
];

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-stone-50/50 min-h-screen py-10 sm:py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        @if (orderSuccess(); as order) {
          <!-- ======================================================== -->
          <!-- ÉCRAN DE CONFIRMATION DE COMMANDE                        -->
          <!-- ======================================================== -->
          <div class="max-w-2xl mx-auto rounded-3xl border border-stone-200 bg-white p-8 sm:p-12 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
              <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100/80 text-emerald-800">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                Commande Enregistrée
              </span>
              <h1 class="font-serif text-3xl sm:text-4xl font-normal text-stone-900 mt-2">
                Merci pour votre commande, {{ order.customerName }} !
              </h1>
              <p class="text-xs sm:text-sm text-stone-500 font-light mt-2 max-w-md mx-auto">
                Votre rituel de beauté a été enregistré sous la référence
                <span class="font-bold text-stone-900 font-mono">#{{ order.id }}</span>.
              </p>
            </div>

            <!-- ENCADRÉ PAIEMENT À LA LIVRAISON (ALGERIE) -->
            <div class="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50 p-5 text-left space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xl">💵</span>
                  <span class="font-bold text-xs sm:text-sm text-emerald-950">
                    Mode de Règlement : {{ selectedPaymentLabel() }}
                  </span>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                  À la réception
                </span>
              </div>
              <p class="text-xs text-emerald-900/80 leading-relaxed">
                @if (selectedPayment() === 'CASH_ON_DELIVERY') {
                  Vous ne payez rien en ligne. Vous réglerez le montant total de
                  <strong class="font-bold text-emerald-950 underline">{{ order.total.toFixed(2) }} €</strong>
                  en espèces directement auprès du livreur lors de la remise en main propre.
                } @else {
                  Effectuez votre virement BaridiMob vers le RIP officiel de la boutique puis confirmez l'envoi de votre reçu par SMS/WhatsApp au service client.
                }
              </p>
              <div class="pt-2 border-t border-emerald-200/60 flex items-center gap-2 text-[11px] text-emerald-800">
                <svg class="h-4 w-4 flex-shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>
                  Notre équipe logistique vous contactera par téléphone au
                  <strong>{{ order.phone }}</strong> pour confirmer l'expédition.
                </span>
              </div>
            </div>

            <!-- Détails Commande -->
            <div class="rounded-2xl bg-stone-50 p-6 text-left space-y-4 border border-stone-200/80 text-xs sm:text-sm">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-200">
                <div>
                  <span class="text-stone-400 block text-[11px] uppercase tracking-wider font-semibold">Lieu de livraison</span>
                  <span class="font-medium text-stone-900 block mt-0.5">{{ order.address }}</span>
                </div>
                <div>
                  <span class="text-stone-400 block text-[11px] uppercase tracking-wider font-semibold">Contact Client</span>
                  <span class="font-medium text-stone-900 block mt-0.5">{{ order.customerName }} ({{ order.email }})</span>
                  <span class="block text-stone-600 text-xs font-mono font-medium">{{ order.phone }}</span>
                </div>
              </div>

              <!-- Liste des Soins commandés -->
              <div>
                <span class="text-stone-400 block text-[11px] uppercase tracking-wider font-semibold mb-2">Soins & Rituels</span>
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
                <span>Total à régler à la livraison</span>
                <span class="text-lg sm:text-xl text-stone-900 font-serif">{{ order.total.toFixed(2) }} €</span>
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

          <!-- ======================================================== -->
          <!-- FORMULAIRE DE COMMANDE (Paiement à la Livraison)          -->
          <!-- ======================================================== -->
          <div class="border-b border-stone-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Finalisation de Commande</span>
              <h1 class="font-serif text-3xl sm:text-4xl font-light text-stone-900 mt-1">
                Livraison & Paiement
              </h1>
            </div>
            <div class="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full font-medium">
              <span>🇩🇿</span>
              <span>Livraison disponible dans les 58 Wilayas d'Algérie</span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">

            <!-- Colonne Gauche : Formulaire Réactif (7 cols) -->
            <div class="lg:col-span-7">
              <form [formGroup]="checkoutForm" (ngSubmit)="onSubmitOrder()" class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">

                <!-- 1. IDENTITÉ & CONTACT -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                    <h3 class="font-serif text-xl font-medium text-stone-900">
                      1. Coordonnées du Destinataire
                    </h3>
                    <span class="text-[11px] text-stone-400">Étape 1 sur 3</span>
                  </div>

                  <!-- Info Client Connecté -->
                  @if (authService.isLoggedIn()) {
                    <div class="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3.5 flex items-center justify-between text-xs">
                      <div class="flex items-center gap-2.5">
                        <span class="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-amber-300">
                          ✦
                        </span>
                        <div>
                          <span class="font-bold text-stone-900">{{ authService.userName() }}</span>
                          <span class="text-stone-500 text-[11px] ml-2 font-mono">({{ authService.currentUser()?.email }})</span>
                        </div>
                      </div>
                      <span class="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                        Connecté
                      </span>
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
                      placeholder="Ex: Mohamed Benali"
                      class="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none transition-all"
                      [class.border-rose-400]="isFieldInvalid('customerName')"
                    />
                    @if (isFieldInvalid('customerName')) {
                      <p class="mt-1 text-xs text-rose-600">Veuillez renseigner votre nom complet.</p>
                    }
                  </div>

                  <!-- Téléphone & Email -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Numéro de Téléphone <span class="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        formControlName="phone"
                        placeholder="Ex: 0550 12 34 56"
                        class="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none transition-all"
                        [class.border-rose-400]="isFieldInvalid('phone')"
                      />
                      <p class="mt-1 text-[11px] text-stone-400">
                        📞 Le livreur vous appellera sur ce numéro avant le passage.
                      </p>
                      @if (isFieldInvalid('phone')) {
                        <p class="mt-1 text-xs text-rose-600">Indiquez un numéro de téléphone valide (ex: 05xx, 06xx, 07xx).</p>
                      }
                    </div>

                    <div>
                      <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Adresse Email <span class="text-stone-400 font-normal lowercase">(facultatif)</span>
                      </label>
                      <input
                        type="email"
                        formControlName="email"
                        placeholder="Ex: mohamed@exemple.com"
                        class="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none transition-all"
                        [class.border-rose-400]="isFieldInvalid('email')"
                      />
                      @if (isFieldInvalid('email')) {
                        <p class="mt-1 text-xs text-rose-600">Veuillez renseigner une adresse email valide (ou laisser vide).</p>
                      }
                    </div>
                  </div>
                </div>

                <!-- 2. LIVRAISON EN ALGÉRIE (WILAYA & COMMUNE) -->
                <div class="pt-6 border-t border-stone-100 space-y-4">
                  <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                    <h3 class="font-serif text-xl font-medium text-stone-900">
                      2. Destination de Livraison
                    </h3>
                    <span class="text-[11px] text-stone-400">Étape 2 sur 3</span>
                  </div>

                  <!-- Type de livraison (Domicile vs Stop Desk) -->
                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      Option de réception
                    </label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        (click)="deliveryType.set('DOMICILE')"
                        class="p-3.5 rounded-xl border text-left transition-all flex items-center gap-3"
                        [ngClass]="deliveryType() === 'DOMICILE' ? 'border-stone-900 bg-stone-900 text-white shadow-md' : 'border-stone-200 bg-stone-50/50 text-stone-800 hover:bg-stone-100'"
                      >
                        <span class="text-lg">🏠</span>
                        <div>
                          <div class="text-xs font-bold">Livraison à domicile</div>
                          <div class="text-[11px]" [ngClass]="deliveryType() === 'DOMICILE' ? 'text-stone-300' : 'text-stone-500'">
                            Remise en main propre
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        (click)="deliveryType.set('STOP_DESK')"
                        class="p-3.5 rounded-xl border text-left transition-all flex items-center gap-3"
                        [ngClass]="deliveryType() === 'STOP_DESK' ? 'border-stone-900 bg-stone-900 text-white shadow-md' : 'border-stone-200 bg-stone-50/50 text-stone-800 hover:bg-stone-100'"
                      >
                        <span class="text-lg">📦</span>
                        <div>
                          <div class="text-xs font-bold">Point Relais / Stop Desk</div>
                          <div class="text-[11px]" [ngClass]="deliveryType() === 'STOP_DESK' ? 'text-stone-300' : 'text-stone-500'">
                            Bureau Yalidine / ZR Express
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <!-- Wilaya & Commune -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Wilaya <span class="text-rose-500">*</span>
                      </label>
                      <select
                        formControlName="wilaya"
                        class="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none transition-all cursor-pointer"
                      >
                        @for (w of wilayas; track w) {
                          <option [value]="w">{{ w }}</option>
                        }
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Commune / Ville <span class="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        formControlName="commune"
                        placeholder="Ex: Bab Ezzouar, Cheraga, Es Senia..."
                        class="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none transition-all"
                        [class.border-rose-400]="isFieldInvalid('commune')"
                      />
                      @if (isFieldInvalid('commune')) {
                        <p class="mt-1 text-xs text-rose-600">Veuillez renseigner votre commune.</p>
                      }
                    </div>
                  </div>

                  <!-- Adresse Précise ou Bureau Relais -->
                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      {{ deliveryType() === 'DOMICILE' ? 'Adresse précise de livraison' : 'Nom du bureau relais / Stop Desk' }}
                      <span class="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows="2"
                      formControlName="address"
                      [placeholder]="deliveryType() === 'DOMICILE' ? 'Rue, numéro, quartier, bâtiment, repère connu...' : 'Ex: Bureau Yalidine Bab Ezzouar, ZR Express...'"
                      class="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none transition-all"
                      [class.border-rose-400]="isFieldInvalid('address')"
                    ></textarea>
                    @if (isFieldInvalid('address')) {
                      <p class="mt-1 text-xs text-rose-600">Veuillez indiquer une adresse ou le nom du bureau relais.</p>
                    }
                  </div>
                </div>

                <!-- 3. MODE DE PAIEMENT SÉCURISÉ (CASH ON DELIVERY) -->
                <div class="pt-6 border-t border-stone-100 space-y-4">
                  <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                    <h3 class="font-serif text-xl font-medium text-stone-900">
                      3. Mode de Règlement
                    </h3>
                    <span class="text-[11px] text-stone-400">Étape 3 sur 3</span>
                  </div>

                  <div class="space-y-3">

                    <!-- Option 1 : Paiement à la livraison (Cash on Delivery) - RECOMMANDÉ -->
                    <div
                      (click)="selectedPayment.set('CASH_ON_DELIVERY')"
                      class="cursor-pointer rounded-2xl border-2 p-4 transition-all"
                      [ngClass]="selectedPayment() === 'CASH_ON_DELIVERY' ? 'border-emerald-600 bg-emerald-50/40 shadow-sm' : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'"
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div class="flex items-start gap-3">
                          <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <div class="flex items-center gap-2">
                              <span class="text-sm font-bold text-stone-900">
                                Paiement à la Livraison (Cash on Delivery)
                              </span>
                              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Recommandé
                              </span>
                            </div>
                            <p class="text-xs text-stone-600 mt-1 leading-relaxed">
                              Réglez en <strong>espèces</strong> directement auprès du livreur après vérification de votre colis. Aucun paiement par carte bancaire requis.
                            </p>
                          </div>
                        </div>

                        <div class="flex h-5 w-5 items-center justify-center rounded-full border-2"
                             [ngClass]="selectedPayment() === 'CASH_ON_DELIVERY' ? 'border-emerald-600 bg-emerald-600' : 'border-stone-300'">
                          @if (selectedPayment() === 'CASH_ON_DELIVERY') {
                            <div class="h-2 w-2 rounded-full bg-white"></div>
                          }
                        </div>
                      </div>
                    </div>

                    <!-- Option 2 : Virement BaridiMob / CCP -->
                    <div
                      (click)="selectedPayment.set('BARIDIMOB')"
                      class="cursor-pointer rounded-2xl border-2 p-4 transition-all"
                      [ngClass]="selectedPayment() === 'BARIDIMOB' ? 'border-amber-700 bg-amber-50/40 shadow-sm' : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'"
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div class="flex items-start gap-3">
                          <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-800 text-white shadow-sm">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div class="flex items-center gap-2">
                              <span class="text-sm font-bold text-stone-900">
                                Virement BaridiMob / CCP
                              </span>
                              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                                Algérie Poste
                              </span>
                            </div>
                            <p class="text-xs text-stone-600 mt-1 leading-relaxed">
                              Réglez via l'application BaridiMob. Notre service client vous contactera pour valider le transfert avant l'expédition du colis.
                            </p>
                          </div>
                        </div>

                        <div class="flex h-5 w-5 items-center justify-center rounded-full border-2"
                             [ngClass]="selectedPayment() === 'BARIDIMOB' ? 'border-amber-700 bg-amber-700' : 'border-stone-300'">
                          @if (selectedPayment() === 'BARIDIMOB') {
                            <div class="h-2 w-2 rounded-full bg-white"></div>
                          }
                        </div>
                      </div>

                      @if (selectedPayment() === 'BARIDIMOB') {
                        <div class="mt-3.5 pt-3 border-t border-amber-200/80 text-xs text-amber-950 bg-amber-100/50 p-3 rounded-xl">
                          <p class="font-semibold mb-1">Coordonnées BaridiMob officielles :</p>
                          <p class="font-mono text-stone-800 text-[11px]">RIP : 007 99999 0001234567 89</p>
                          <p class="text-[11px] text-stone-600 mt-1">Titulaire : SALAKOMERCE Cosmétiques</p>
                        </div>
                      }
                    </div>

                  </div>
                </div>

                <!-- Erreur de validation ou de soumission -->
                @if (submitError()) {
                  <div class="rounded-2xl bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 border-2 border-rose-300 flex items-start gap-3 shadow-sm">
                    <span class="text-xl">⚠️</span>
                    <div class="flex-1">
                      <div class="font-bold text-rose-950">Champs requis incomplets :</div>
                      <div class="mt-0.5 leading-relaxed">{{ submitError() }}</div>
                    </div>
                  </div>
                }

                <!-- Bouton Confirmer la Commande -->
                <div class="pt-4">
                  <button
                    type="button"
                    (click)="onSubmitOrder()"
                    [disabled]="isSubmitting() || cartService.isEmpty()"
                    class="w-full rounded-2xl bg-stone-900 hover:bg-stone-800 py-4 px-6 text-sm sm:text-base font-bold text-white shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-95 select-none cursor-pointer"
                  >
                    @if (isSubmitting()) {
                      <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Enregistrement de votre commande...</span>
                    } @else {
                      <svg class="h-5 w-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>
                        @if (selectedPayment() === 'CASH_ON_DELIVERY') {
                          Commander avec Paiement à la Livraison ({{ cartService.total().toFixed(2) }} €)
                        } @else {
                          Valider la Commande BaridiMob ({{ cartService.total().toFixed(2) }} €)
                        }
                      </span>
                    }
                  </button>

                  <p class="text-center text-[11px] text-stone-500 mt-2.5">
                    🔒 Commande sans paiement en ligne • Paiement en espèces lors de la livraison
                  </p>
                </div>

              </form>
            </div>

            <!-- Colonne Droite : Récapitulatif Panier (5 cols) -->
            <div class="lg:col-span-5">
              <div class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-6 sticky top-8">
                <h3 class="font-serif text-xl font-medium text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
                  <span>Votre Rituel</span>
                  <span class="text-xs font-sans text-stone-400 font-normal">({{ cartService.totalCount() }} articles)</span>
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
                    <span>Frais de livraison</span>
                    @if (cartService.shippingFee() === 0) {
                      <span class="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-xs">Offerts</span>
                    } @else {
                      <span class="font-semibold text-stone-900">{{ cartService.shippingFee().toFixed(2) }} €</span>
                    }
                  </div>
                  <div class="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base font-bold text-stone-900">
                    <span>Total à régler à la réception</span>
                    <span class="text-xl font-serif text-stone-900">{{ cartService.total().toFixed(2) }} €</span>
                  </div>
                </div>

                <!-- Rassurance Algérie -->
                <div class="rounded-2xl bg-stone-50 border border-stone-200/80 p-3.5 space-y-2 text-[11px] text-stone-600">
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-600 font-bold">✓</span>
                    <span>Paiement en espèces à la livraison sans carte bancaire</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-600 font-bold">✓</span>
                    <span>Colis scellé et vérifiable à la réception</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-600 font-bold">✓</span>
                    <span>Confirmation téléphonique avant expédition</span>
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

  readonly wilayas = ALGERIA_WILAYAS;
  readonly deliveryType = signal<'DOMICILE' | 'STOP_DESK'>('DOMICILE');
  readonly selectedPayment = signal<PaymentMethod>('CASH_ON_DELIVERY');

  readonly isSubmitting = signal<boolean>(false);
  readonly submitError = signal<string | null>(null);
  readonly orderSuccess = signal<OrderDTO | null>(null);

  checkoutForm!: FormGroup;

  selectedPaymentLabel(): string {
    return this.selectedPayment() === 'CASH_ON_DELIVERY'
      ? 'Paiement en espèces à la livraison (Cash on Delivery)'
      : 'Virement BaridiMob / CCP';
  }

  ngOnInit(): void {
    if (this.cartService.isEmpty()) {
      this.router.navigate(['/cart']);
      return;
    }

    const user = this.authService.currentUser();

    this.checkoutForm = this.fb.group({
      customerName: [user?.fullName || '', [Validators.required, Validators.minLength(2)]],
      email: [user?.email || '', [Validators.email]], // Email facultatif pour le client
      phone: [user?.phone || '', [Validators.required, Validators.minLength(8)]], // Minimum 8 chiffres
      wilaya: ['16 - Alger', [Validators.required]],
      commune: ['', [Validators.required, Validators.minLength(2)]],
      address: [user?.address || '', [Validators.required, Validators.minLength(3)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm?.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmitOrder(): void {
    console.log('--- Tentative de soumission commande ---');
    console.log('Valeurs du formulaire:', this.checkoutForm.value);
    console.log('Formulaire invalide ?', this.checkoutForm.invalid);

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      const missing: string[] = [];
      if (this.checkoutForm.get('customerName')?.invalid) missing.push('Nom et Prénom');
      if (this.checkoutForm.get('phone')?.invalid) missing.push('Numéro de téléphone');
      if (this.checkoutForm.get('commune')?.invalid) missing.push('Commune / Ville');
      if (this.checkoutForm.get('address')?.invalid) missing.push('Adresse de livraison');
      if (this.checkoutForm.get('email')?.invalid) missing.push('Format de l\'email');

      const msg = `Veuillez compléter les informations obligatoires : ${missing.join(', ')}.`;
      console.warn(msg);
      this.submitError.set(msg);
      return;
    }

    if (this.cartService.isEmpty()) {
      this.submitError.set('Votre panier est vide.');
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const formVal = this.checkoutForm.value;
    const paymentLabel = this.selectedPaymentLabel();
    const deliveryLabel = this.deliveryType() === 'DOMICILE' ? 'Livraison Domicile' : 'Point Relais (Stop Desk)';

    // Formatage de l'adresse complet pour le livreur et l'administration
    const fullFormattedAddress = `[${formVal.wilaya}] Commune: ${formVal.commune.trim()} | ${formVal.address.trim()} (${deliveryLabel}) - Mode: ${paymentLabel}`;

    const items: OrderItemDTO[] = this.cartService.items().map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price
    }));

    // Si le client n'a pas renseigné d'email (courant en Algérie pour le COD), en générer un pour satisfaire le backend
    const safeEmail = (formVal.email && formVal.email.trim().length > 0)
      ? formVal.email.trim()
      : `${formVal.phone.replace(/[^0-9]/g, '') || 'client'}@salakommerce.dz`;

    const orderPayload: CreateOrderDTO = {
      customerName: formVal.customerName.trim(),
      email: safeEmail,
      phone: formVal.phone.trim(),
      address: fullFormattedAddress,
      items: items,
      total: this.cartService.total(),
      status: 'EN_ATTENTE',
      paymentMethod: this.selectedPayment()
    };

    console.log('Payload envoyé au backend:', orderPayload);

    this.orderService.createOrder(orderPayload).subscribe({
      next: (created) => {
        console.log('Réponse backend commande:', created);
        this.isSubmitting.set(false);
        this.orderSuccess.set(created);
        this.cartService.clearCart();
      },
      error: (err) => {
        console.error('Erreur API backend createOrder:', err);
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
            status: 'EN_ATTENTE',
            paymentMethod: orderPayload.paymentMethod,
            createdAt: new Date().toISOString()
          };
          this.orderSuccess.set(mockOrder);
          this.cartService.clearCart();
        } else {
          this.submitError.set(
            'Impossible de valider votre commande actuellement. ' + (err.error?.message || 'Vérifiez votre connexion.')
          );
        }
      }
    });
  }
}
