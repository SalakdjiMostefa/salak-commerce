import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HealthService } from '../../services/health.service';
import { TranslationService } from '../../services/translation.service';

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
                <h4 class="text-sm font-semibold text-white">{{ ts.t('footer.pil_1_title') }}</h4>
                <p class="mt-1 text-xs text-stone-400 leading-relaxed">{{ ts.t('footer.pil_1_desc') }}</p>
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
                <h4 class="text-sm font-semibold text-white">{{ ts.t('footer.pil_2_title') }}</h4>
                <p class="mt-1 text-xs text-stone-400 leading-relaxed">{{ ts.t('footer.pil_2_desc') }}</p>
              </div>
            </div>

            <!-- Pilier 3 : Paiement à la Livraison -->
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-stone-800 text-amber-300">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-white">{{ ts.t('footer.pil_3_title') }}</h4>
                <p class="mt-1 text-xs text-stone-400 leading-relaxed">{{ ts.t('footer.pil_3_desc') }}</p>
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
                <h4 class="text-sm font-semibold text-white">{{ ts.t('footer.pil_4_title') }}</h4>
                <p class="mt-1 text-xs text-stone-400 leading-relaxed">{{ ts.t('footer.pil_4_desc') }}</p>
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
            <div class="flex items-center gap-3 select-none">
              <div class="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 via-stone-800 to-stone-900 p-2 shadow-lg ring-1 ring-amber-400/40">
                <svg class="h-full w-full text-amber-300" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L42 24L24 44L6 24L24 4Z" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.35"/>
                  <path d="M30 15C29 13.2 26 12 23 12.5C19 13.2 17.5 16.5 18.5 20C19.8 24 28.5 24.5 29.2 28.5C29.8 32.5 26 35 21.8 35C18 35 15.5 33 14.5 30.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="24" cy="4" r="1.5" fill="currentColor"/>
                  <circle cx="24" cy="44" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="font-serif text-2xl font-semibold tracking-[0.16em] text-white">
                  SALAK<span class="font-light text-amber-300">OMERCE</span>
                </span>
                <span class="text-[9px] tracking-[0.32em] uppercase text-amber-400/90 font-semibold -mt-0.5">
                  Haute Beauté & Rituels
                </span>
              </div>
            </div>
            <p class="mt-4 text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              {{ ts.t('footer.tagline') }}
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
          <p>© 2026 SALAKOMERCE. Tous droits réservés.</p>

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
  readonly ts = inject(TranslationService);
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
