import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <footer class="border-t border-stone-200 bg-stone-900 text-stone-300">
      <!-- Section Réassurance Client (4 Piliers Beauté) -->
      <div class="border-b border-stone-800 py-10 sm:py-12">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

            <!-- Pilier 1 : Livraison -->
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-stone-800 text-amber-300">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Livraison Offerte</h4>
                <p class="mt-1 text-xs text-stone-400 leading-relaxed">Dès 50€ d'achat partout en France. Expédition soignée sous 24h.</p>
              </div>
            </div>

            <!-- Pilier 2 : Ingrédients -->
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-stone-800 text-amber-300">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Formules Nobles & Pures</h4>
                <p class="mt-1 text-xs text-stone-400 leading-relaxed">Extraits botaniques certifiés bio, testés dermatologiquement sans cruauté.</p>
              </div>
            </div>

            <!-- Pilier 3 : Paiement Sécurisé -->
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-stone-800 text-amber-300">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Paiement 100% Sécurisé</h4>
                <p class="mt-1 text-xs text-stone-400 leading-relaxed">Transactions cryptées SSL avec Visa, MasterCard, Carte Bancaire et Apple Pay.</p>
              </div>
            </div>

            <!-- Pilier 4 : Conseils Beauté -->
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-stone-800 text-amber-300">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">Service Client Dédié</h4>
                <p class="mt-1 text-xs text-stone-400 leading-relaxed">Nos esthéticiennes vous conseillent avec bienveillance du lundi au samedi.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Navigation & Newsletter -->
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">

          <!-- Colonne Marque (2 cols) -->
          <div class="lg:col-span-2">
            <span class="font-serif text-3xl font-medium tracking-widest text-white">AURA</span>
            <span class="block text-[10px] tracking-[0.3em] uppercase text-amber-300 font-medium mt-0.5">Cosmétiques</span>
            <p class="mt-4 text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Maison de haute cosmétique végétale. Nous allions l'alchimie botanique et les technologies cellulaires de pointe pour magnifier votre beauté originelle en toute sérénité.
            </p>
            <div class="mt-6 flex space-x-4 text-stone-400">
              <span class="hover:text-amber-300 transition-colors cursor-pointer text-xs font-medium">Instagram</span>
              <span>•</span>
              <span class="hover:text-amber-300 transition-colors cursor-pointer text-xs font-medium">Pinterest</span>
              <span>•</span>
              <span class="hover:text-amber-300 transition-colors cursor-pointer text-xs font-medium">TikTok</span>
            </div>
          </div>

          <!-- Liens Soins -->
          <div>
            <h5 class="text-xs font-semibold uppercase tracking-wider text-white">Les Soins</h5>
            <ul class="mt-4 space-y-2.5 text-xs text-stone-400">
              <li><a routerLink="/catalog" class="hover:text-amber-300 transition-colors">Tous nos soins</a></li>
              <li><a routerLink="/catalog" [queryParams]="{ filter: 'nouveau' }" class="hover:text-amber-300 transition-colors">Nouveautés</a></li>
              <li><a routerLink="/catalog" class="hover:text-amber-300 transition-colors">Sérums & Huiles</a></li>
              <li><a routerLink="/catalog" class="hover:text-amber-300 transition-colors">Crèmes Hydratantes</a></li>
              <li><a routerLink="/catalog" class="hover:text-amber-300 transition-colors">Masques Purifiants</a></li>
            </ul>
          </div>

          <!-- Liens Maison -->
          <div>
            <h5 class="text-xs font-semibold uppercase tracking-wider text-white">La Maison</h5>
            <ul class="mt-4 space-y-2.5 text-xs text-stone-400">
              <li><a routerLink="/" class="hover:text-amber-300 transition-colors">Notre Philosophie</a></li>
              <li><a routerLink="/" class="hover:text-amber-300 transition-colors">Charte Éco-responsable</a></li>
              <li><a routerLink="/favorites" class="hover:text-amber-300 transition-colors">Mes Favoris</a></li>
              <li><a routerLink="/admin" class="hover:text-amber-300 transition-colors">Accès Administrateur</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h5 class="text-xs font-semibold uppercase tracking-wider text-white">Le Cercle Privé</h5>
            <p class="mt-3 text-xs text-stone-400 leading-relaxed">
              Inscrivez-vous pour recevoir nos invitations exclusives et 10% de bienvenue.
            </p>
            <form (ngSubmit)="subscribeNewsletter()" class="mt-4">
              <div class="flex flex-col gap-2">
                <input
                  type="email"
                  [(ngModel)]="emailSubscription"
                  name="newsletterEmail"
                  placeholder="votre@email.com"
                  required
                  class="w-full rounded-xl border border-stone-700 bg-stone-800/80 px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:border-amber-300 focus:outline-none"
                />
                <button
                  type="submit"
                  class="w-full rounded-xl bg-amber-400/90 hover:bg-amber-400 text-stone-950 px-3.5 py-2 text-xs font-semibold transition-all active:scale-95"
                >
                  @if (subscribed()) {
                    ✓ Bienvenue dans le Cercle !
                  } @else {
                    S'inscrire
                  }
                </button>
              </div>
            </form>
          </div>

        </div>

        <!-- Bas de page -->
        <div class="mt-12 border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 AURA Cosmétiques. Tous droits réservés.</p>

          <!-- Statut API Backend Live -->
          <div class="flex items-center gap-2 text-[11px] bg-stone-900/90 px-3 py-1.5 rounded-full border border-stone-800">
            <span
              class="flex h-2 w-2 rounded-full"
              [class.bg-emerald-400]="healthService.isOnline()"
              [class.animate-pulse]="healthService.isOnline()"
              [class.bg-rose-500]="healthService.isOnline() === false"
              [class.bg-amber-400]="healthService.isOnline() === null"
            ></span>
            <span>
              API Backend :
              @if (healthService.isOnline()) {
                <span class="text-emerald-400 font-mono font-medium">Connectée (8080)</span>
                @if (healthService.latencyMs() !== null) {
                  <span class="text-stone-400 font-mono text-[10px]">[{{ healthService.latencyMs() }}ms]</span>
                }
              } @else {
                <span class="text-stone-400 font-mono">Mode Autonome</span>
              }
            </span>
          </div>

          <div class="flex space-x-6">
            <span class="hover:text-stone-400 transition-colors cursor-pointer">Conditions Générales</span>
            <span class="hover:text-stone-400 transition-colors cursor-pointer">Confidentialité</span>
            <span class="hover:text-stone-400 transition-colors cursor-pointer">Mentions Légales</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  readonly healthService = inject(HealthService);
  emailSubscription = '';
  readonly subscribed = signal<boolean>(false);

  subscribeNewsletter(): void {
    if (this.emailSubscription.includes('@')) {
      this.subscribed.set(true);
      setTimeout(() => {
        this.emailSubscription = '';
        this.subscribed.set(false);
      }, 3500);
    }
  }
}
