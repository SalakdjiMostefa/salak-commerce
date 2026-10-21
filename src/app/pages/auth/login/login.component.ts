import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AuthUser } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-stone-100 via-rose-50/30 to-amber-50/25 flex items-center justify-center px-4 py-12 sm:py-16">
      <div class="w-full max-w-lg">

        <!-- En-tête / Logo SALAKOMERCE -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex flex-col items-center group select-none">
            <!-- Emblème Monogramme Luxe "S" -->
            <div class="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 p-3 shadow-xl ring-2 ring-amber-400/40 group-hover:scale-105 group-hover:ring-amber-400/70 transition-all duration-300 mb-3">
              <svg class="h-full w-full text-amber-300" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L42 24L24 44L6 24L24 4Z" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.35"/>
                <path d="M30 15C29 13.2 26 12 23 12.5C19 13.2 17.5 16.5 18.5 20C19.8 24 28.5 24.5 29.2 28.5C29.8 32.5 26 35 21.8 35C18 35 15.5 33 14.5 30.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="24" cy="4" r="1.5" fill="currentColor"/>
                <circle cx="24" cy="44" r="1.5" fill="currentColor"/>
              </svg>
              <span class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 animate-pulse"></span>
            </div>
            <span class="font-serif text-3xl sm:text-4xl font-semibold tracking-[0.16em] text-stone-900 group-hover:text-amber-900 transition-colors">
              SALAK<span class="font-light text-amber-800">OMERCE</span>
            </span>
            <span class="block text-[10px] tracking-[0.38em] uppercase text-amber-800 font-semibold mt-1">
              Maison de Haute Beauté
            </span>
          </a>
          <p class="text-xs sm:text-sm text-stone-500 mt-2 font-light tracking-wide">
            Espace Privilège & Rituels Précieux
          </p>
        </div>

        <!-- Carte Principale Auth -->
        <div class="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-2xl shadow-stone-200/50 space-y-6">

          <!-- Onglets : Connexion / Créer un compte -->
          <div class="flex rounded-2xl bg-stone-100 p-1 text-xs font-medium text-stone-600">
            <button
              type="button"
              (click)="activeTab.set('login'); errorMessage.set(null); successMessage.set(null)"
              [class.bg-white]="activeTab() === 'login'"
              [class.text-stone-900]="activeTab() === 'login'"
              [class.shadow-sm]="activeTab() === 'login'"
              class="flex-1 py-2.5 rounded-xl transition-all font-semibold uppercase tracking-wider"
            >
              Se connecter
            </button>
            <button
              type="button"
              (click)="activeTab.set('register'); errorMessage.set(null); successMessage.set(null)"
              [class.bg-white]="activeTab() === 'register'"
              [class.text-stone-900]="activeTab() === 'register'"
              [class.shadow-sm]="activeTab() === 'register'"
              class="flex-1 py-2.5 rounded-xl transition-all font-semibold uppercase tracking-wider"
            >
              Créer un compte
            </button>
          </div>

          <!-- Message de succès -->
          @if (successMessage()) {
            <div class="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex items-start gap-2.5">
              <svg class="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ successMessage() }}</span>
            </div>
          }

          <!-- Message d'erreur -->
          @if (errorMessage()) {
            <div class="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-700 flex items-start gap-2.5">
              <svg class="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <!-- TAB 1 : FORMULAIRE DE CONNEXION -->
          @if (activeTab() === 'login') {
            <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" class="space-y-4">

              <!-- Email -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Adresse Email
                </label>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="votre@email.com"
                  class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
                  [class.border-rose-400]="isLoginInvalid('email')"
                  autocomplete="email"
                />
                @if (isLoginInvalid('email')) {
                  <p class="mt-1 text-xs text-rose-600">Veuillez renseigner un email valide.</p>
                }
              </div>

              <!-- Mot de passe -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Mot de passe
                </label>
                <div class="relative">
                  <input
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="••••••••"
                    class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 pr-11 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
                    [class.border-rose-400]="isLoginInvalid('password')"
                    autocomplete="current-password"
                  />
                  <button
                    type="button"
                    (click)="showPassword.set(!showPassword())"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                    aria-label="Afficher ou masquer le mot de passe"
                  >
                    @if (showPassword()) {
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    } @else {
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    }
                  </button>
                </div>
                @if (isLoginInvalid('password')) {
                  <p class="mt-1 text-xs text-rose-600">Le mot de passe est obligatoire.</p>
                }
              </div>

              <!-- Bouton Connexion -->
              <button
                type="submit"
                [disabled]="isLoading()"
                class="w-full rounded-xl bg-stone-900 py-3.5 px-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-stone-900/10 hover:bg-stone-800 disabled:opacity-60 transition-all flex items-center justify-center gap-2 mt-2"
              >
                @if (isLoading()) {
                  <svg class="h-4 w-4 animate-spin text-amber-300" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>Connexion en cours...</span>
                } @else {
                  <span>Se connecter</span>
                }
              </button>
            </form>
          }

          <!-- TAB 2 : FORMULAIRE D'INSCRIPTION -->
          @if (activeTab() === 'register') {
            <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" class="space-y-4">

              <!-- Nom complet -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Nom & Prénom
                </label>
                <input
                  type="text"
                  formControlName="fullName"
                  placeholder="Éléonore de Montmirail"
                  class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
                  [class.border-rose-400]="isRegisterInvalid('fullName')"
                />
                @if (isRegisterInvalid('fullName')) {
                  <p class="mt-1 text-xs text-rose-600">Veuillez indiquer votre nom complet.</p>
                }
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Adresse Email
                </label>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="eleonore@email.fr"
                  class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
                  [class.border-rose-400]="isRegisterInvalid('email')"
                />
                @if (isRegisterInvalid('email')) {
                  <p class="mt-1 text-xs text-rose-600">Veuillez renseigner un email valide.</p>
                }
              </div>

              <!-- Mot de passe -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Mot de passe (6 caractères min.)
                </label>
                <input
                  type="password"
                  formControlName="password"
                  placeholder="••••••••"
                  class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
                  [class.border-rose-400]="isRegisterInvalid('password')"
                />
                @if (isRegisterInvalid('password')) {
                  <p class="mt-1 text-xs text-rose-600">Le mot de passe doit comporter au moins 6 caractères.</p>
                }
              </div>

              <!-- Téléphone (optionnel) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Téléphone <span class="text-[10px] text-stone-400 normal-case">(optionnel)</span>
                  </label>
                  <input
                    type="tel"
                    formControlName="phone"
                    placeholder="06 12 34 56 78"
                    class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Ville <span class="text-[10px] text-stone-400 normal-case">(optionnel)</span>
                  </label>
                  <input
                    type="text"
                    formControlName="address"
                    placeholder="Paris"
                    class="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <!-- Bouton Inscription -->
              <button
                type="submit"
                [disabled]="isLoading()"
                class="w-full rounded-xl bg-amber-900 py-3.5 px-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-amber-900/15 hover:bg-amber-800 disabled:opacity-60 transition-all flex items-center justify-center gap-2 mt-2"
              >
                @if (isLoading()) {
                  <svg class="h-4 w-4 animate-spin text-amber-200" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>Création du compte...</span>
                } @else {
                  <span>Créer mon compte SALAKOMERCE</span>
                }
              </button>
            </form>
          }

          <!-- Boutons de Démonstration 1-CLIC -->
          <div class="rounded-2xl bg-stone-50 border border-stone-200/80 p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] uppercase tracking-wider font-semibold text-stone-700 flex items-center gap-1.5">
                <span class="text-amber-600">✦</span>
                Connexion rapide (Mode Démo)
              </span>
              <span class="text-[10px] text-stone-600">1 clic pour tester</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <!-- Démo Admin -->
              <button
                type="button"
                (click)="quickLogin('admin@aura-cosmetics.fr', 'admin2026')"
                class="flex items-center justify-between p-3 rounded-xl border border-amber-200/90 bg-amber-50/60 hover:bg-amber-100/70 hover:border-amber-300 transition-all text-left group"
              >
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="h-2 w-2 rounded-full bg-amber-600"></span>
                    <span class="text-xs font-bold text-stone-900">Directrice (Admin)</span>
                  </div>
                  <span class="text-[11px] text-stone-500 font-mono block mt-0.5">admin&#64;aura-cosmetics.fr</span>
                </div>
                <svg class="h-4 w-4 text-amber-700 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- Démo Client -->
              <button
                type="button"
                (click)="quickLogin('sophie@example.fr', 'client2026')"
                class="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 hover:border-stone-300 transition-all text-left group"
              >
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="h-2 w-2 rounded-full bg-stone-400"></span>
                    <span class="text-xs font-bold text-stone-900">Sophie (Client)</span>
                  </div>
                  <span class="text-[11px] text-stone-500 font-mono block mt-0.5">sophie&#64;example.fr</span>
                </div>
                <svg class="h-4 w-4 text-stone-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Retour Boutique -->
          <div class="text-center pt-2 border-t border-stone-100">
            <a routerLink="/" class="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Continuer sans se connecter (Retour à la boutique)</span>
            </a>
          </div>

        </div>

        <!-- Badges de réassurance -->
        <div class="mt-6 flex items-center justify-center gap-6 text-[11px] text-stone-500 font-light">
          <div class="flex items-center gap-1.5">
            <svg class="h-3.5 w-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Connexion Chiffrée SSL</span>
          </div>
          <span>•</span>
          <div class="flex items-center gap-1.5">
            <svg class="h-3.5 w-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Données Protégées RGPD</span>
          </div>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly activeTab = signal<'login' | 'register'>('login');
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: [''],
    address: ['']
  });

  isLoginInvalid(field: string): boolean {
    const ctrl = this.loginForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  isRegisterInvalid(field: string): boolean {
    const ctrl = this.registerForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  quickLogin(email: string, pass: string): void {
    this.activeTab.set('login');
    this.loginForm.patchValue({ email, password: pass });
    this.onLoginSubmit();
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: (user: AuthUser) => {
        this.isLoading.set(false);
        if (user.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Email ou mot de passe incorrect.');
      }
    });
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Votre compte a été créé avec succès ! Bienvenue chez SALAKOMERCE.');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1200);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || "Erreur lors de la création du compte.");
      }
    });
  }
}
