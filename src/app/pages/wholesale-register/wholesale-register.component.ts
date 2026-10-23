import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { WholesaleRegistrationRequest } from '../../models/auth.model';

@Component({
  selector: 'app-wholesale-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-stone-50/60 py-12 sm:py-16">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <!-- Carte Principale -->
        <div class="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-12 shadow-xl shadow-stone-200/50">

          <!-- En-tête Espace Pro -->
          <div class="text-center space-y-3 mb-10">
            <div class="inline-flex items-center gap-2 rounded-full bg-amber-100/70 px-4 py-1.5 text-xs font-bold text-amber-900 border border-amber-200/60 shadow-xs">
              <span>✦</span>
              <span>ESPACE B2B & REVENDEURS</span>
              <span>✦</span>
            </div>
            <h1 class="font-serif text-3xl sm:text-4xl font-semibold text-stone-900">
              {{ ts.t('wholesale.title') }}
            </h1>
            <p class="text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
              {{ ts.t('wholesale.subtitle') }}
            </p>
          </div>

          <!-- Si l'utilisateur est déjà Grossiste Validé -->
          @if (authService.isWholesale()) {
            <div class="p-8 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-4 animate-in fade-in">
              <span class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-900 text-2xl text-amber-300 shadow-md">
                ✓
              </span>
              <h2 class="text-xl font-serif font-bold text-stone-900">Votre compte grossiste est déjà actif</h2>
              <p class="text-xs text-stone-600 max-w-md mx-auto">
                Bienvenue <strong>{{ authService.companyName() || authService.userName() }}</strong>. Vous bénéficiez déjà des tarifs grossistes réservés aux professionnels.
              </p>
              <div class="pt-4">
                <a routerLink="/catalog" class="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-stone-800 transition-all shadow-md">
                  Commander au tarif grossiste →
                </a>
              </div>
            </div>
          } @else if (authService.isWholesalePending() || requestSent()) {
            <!-- Si la demande est EN ATTENTE (PENDING) -->
            <div class="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-4 animate-in fade-in">
              <div class="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-800 shadow-inner">
                <svg class="h-8 w-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 class="text-xl font-serif font-bold text-stone-900">
                {{ ts.t('wholesale.pending_title') }}
              </h2>
              <p class="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                {{ ts.t('wholesale.pending_desc') }}
              </p>
              <div class="p-3 bg-white rounded-xl border border-stone-200/80 text-xs text-stone-500 max-w-sm mx-auto">
                Statut actuel : <span class="font-bold text-amber-800">⏳ En cours d'examen par l'administrateur</span>
              </div>
              <div class="pt-4 flex justify-center gap-3">
                <a routerLink="/catalog" class="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors">
                  Continuer la visite
                </a>
              </div>
            </div>
          } @else {
            <!-- FORMULAIRE DE CANDIDATURE GROSSISTE -->
            <form (ngSubmit)="onSubmit()" class="space-y-6">

              <!-- Message d'erreur -->
              @if (errorMessage()) {
                <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {{ errorMessage() }}
                </div>
              }

              <!-- Grille champs entreprise -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Nom Société -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    {{ ts.t('wholesale.company_name') }} *
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="form.companyName"
                    name="companyName"
                    required
                    placeholder="Ex: Institut Éclat Royal, Parapharmacie..."
                    class="w-full rounded-xl border border-stone-300 bg-stone-50/60 py-2.5 px-3.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 focus:outline-none transition-all"
                  />
                </div>

                <!-- N° Registre de Commerce -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    {{ ts.t('wholesale.trade_register') }} *
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="form.tradeRegister"
                    name="tradeRegister"
                    required
                    placeholder="Ex: RC-2024-B-9988 / SIRET..."
                    class="w-full rounded-xl border border-stone-300 bg-stone-50/60 py-2.5 px-3.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 focus:outline-none transition-all"
                  />
                </div>

                <!-- Nom complet Responsable -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Nom du gérant / contact *
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="form.fullName"
                    name="fullName"
                    required
                    placeholder="Prénom et Nom"
                    class="w-full rounded-xl border border-stone-300 bg-stone-50/60 py-2.5 px-3.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 focus:outline-none transition-all"
                  />
                </div>

                <!-- Téléphone Pro -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    {{ ts.t('wholesale.business_phone') }} *
                  </label>
                  <input
                    type="tel"
                    [(ngModel)]="form.phone"
                    name="phone"
                    required
                    placeholder="+33 / 06 / +213..."
                    class="w-full rounded-xl border border-stone-300 bg-stone-50/60 py-2.5 px-3.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 focus:outline-none transition-all"
                  />
                </div>

                <!-- Email Professionnel -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Email professionnel *
                  </label>
                  <input
                    type="email"
                    [(ngModel)]="form.email"
                    name="email"
                    required
                    placeholder="contact@votre-salon.fr"
                    class="w-full rounded-xl border border-stone-300 bg-stone-50/60 py-2.5 px-3.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 focus:outline-none transition-all"
                  />
                </div>

                <!-- Mot de passe -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Mot de passe pour votre compte *
                  </label>
                  <input
                    type="password"
                    [(ngModel)]="form.password"
                    name="password"
                    required
                    minlength="6"
                    placeholder="Minimum 6 caractères"
                    class="w-full rounded-xl border border-stone-300 bg-stone-50/60 py-2.5 px-3.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <!-- Adresse Boutique / Institut -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  {{ ts.t('wholesale.business_address') }} *
                </label>
                <textarea
                  [(ngModel)]="form.businessAddress"
                  name="businessAddress"
                  required
                  rows="2"
                  placeholder="Numéro, rue, ville, code postal de votre institut ou magasin..."
                  class="w-full rounded-xl border border-stone-300 bg-stone-50/60 py-2.5 px-3.5 text-xs text-stone-900 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 focus:outline-none transition-all"
                ></textarea>
              </div>

              <!-- Réassurance B2B -->
              <div class="rounded-2xl bg-amber-50/50 p-4 border border-amber-200/50 space-y-1.5 text-xs text-amber-900">
                <div class="flex items-center gap-2 font-semibold">
                  <span>✦</span>
                  <span>Validation manuelle par notre équipe sous 24h</span>
                </div>
                <p class="text-[11px] text-stone-500 leading-relaxed">
                  Dès approbation, vos tarifs grossistes s'activeront automatiquement lors de vos prochaines connexions avec cet email.
                </p>
              </div>

              <!-- Bouton Soumission -->
              <button
                type="submit"
                [disabled]="loading()"
                class="w-full rounded-2xl bg-stone-900 py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xl hover:bg-stone-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                @if (loading()) {
                  <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <span>Transmission du dossier...</span>
                } @else {
                  <span>{{ ts.t('wholesale.submit_request') }}</span>
                  <span>→</span>
                }
              </button>

              <div class="text-center pt-2">
                <span class="text-xs text-stone-500">Vous avez déjà un compte grossiste validé ?</span>
                <a routerLink="/login" class="text-xs font-bold text-amber-900 hover:underline ms-1">
                  Se connecter
                </a>
              </div>
            </form>
          }

        </div>
      </div>
    </div>
  `
})
export class WholesaleRegisterComponent {
  readonly authService = inject(AuthService);
  readonly ts = inject(TranslationService);
  private readonly router = inject(Router);

  readonly loading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly requestSent = signal<boolean>(false);

  form: WholesaleRegistrationRequest = {
    companyName: '',
    tradeRegister: '',
    fullName: '',
    phone: '',
    email: '',
    password: '',
    businessAddress: ''
  };

  onSubmit(): void {
    if (!this.form.companyName || !this.form.tradeRegister || !this.form.email || !this.form.password) {
      this.errorMessage.set('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.registerWholesale(this.form).subscribe({
      next: () => {
        this.loading.set(false);
        this.requestSent.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.message || "Une erreur est survenue lors de l'envoi de votre candidature.");
      }
    });
  }
}
