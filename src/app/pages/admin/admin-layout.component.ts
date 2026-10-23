import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="bg-stone-100/70 min-h-screen">
      <!-- Admin Top Bar -->
      <div class="border-b border-stone-200 bg-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-stone-900 to-amber-950 p-1.5 shadow-sm ring-1 ring-amber-400/40">
                <svg class="h-full w-full text-amber-300" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L42 24L24 44L6 24L24 4Z" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.35"/>
                  <path d="M30 15C29 13.2 26 12 23 12.5C19 13.2 17.5 16.5 18.5 20C19.8 24 28.5 24.5 29.2 28.5C29.8 32.5 26 35 21.8 35C18 35 15.5 33 14.5 30.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="font-serif text-lg font-bold tracking-wider text-stone-900 flex items-center gap-2">
                SALAKOMERCE <span class="text-xs font-sans font-semibold uppercase text-amber-800 tracking-normal px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">Admin Studio</span>
              </span>

              <!-- Indicateur API Live -->
              <div class="hidden lg:flex items-center gap-2 pl-4 border-l border-stone-200">
                <span class="relative flex h-2.5 w-2.5">
                  @if (healthService.isOnline()) {
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  } @else {
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  }
                </span>
                <span class="text-[11px] font-medium text-stone-600">
                  {{ healthService.isOnline() ? 'API : Connectée (8080)' : 'API : Mode Démo' }}
                </span>
              </div>
            </div>

            <!-- Navigation Onglets Admin -->
            <nav class="hidden sm:flex space-x-1 sm:space-x-3 text-xs sm:text-sm font-medium">
              <a
                routerLink="/admin/dashboard"
                routerLinkActive="bg-stone-900 text-white shadow-sm"
                class="rounded-xl px-3 sm:px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all"
              >
                Tableau de Bord
              </a>
              <a
                routerLink="/admin/products"
                routerLinkActive="bg-stone-900 text-white shadow-sm"
                class="rounded-xl px-3 sm:px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all"
              >
                Catalogue Soins
              </a>
              <a
                routerLink="/admin/categories"
                routerLinkActive="bg-stone-900 text-white shadow-sm"
                class="rounded-xl px-3 sm:px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all"
              >
                Catégories
              </a>
              <a
                routerLink="/admin/orders"
                routerLinkActive="bg-stone-900 text-white shadow-sm"
                class="rounded-xl px-3 sm:px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all"
              >
                Commandes
              </a>
              <a
                routerLink="/admin/wholesale"
                routerLinkActive="bg-stone-900 text-white shadow-sm"
                class="rounded-xl px-3 sm:px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all flex items-center gap-1"
              >
                <span>Grossistes</span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900">B2B</span>
              </a>
            </nav>

            <!-- Profil Admin & Actions -->
            <div class="flex items-center space-x-3">
              <!-- Admin User Pill -->
              <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-xs">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-[9px] font-bold text-amber-300">
                  {{ getInitials() }}
                </span>
                <span class="font-semibold text-stone-800 max-w-[120px] truncate">
                  {{ authService.userName() || 'Admin' }}
                </span>
              </div>

              <!-- Voir la boutique -->
              <a
                routerLink="/"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 px-3 py-1.5 rounded-xl hover:bg-stone-50 transition-colors"
                title="Retourner vers la boutique"
              >
                <span>Boutique</span>
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <!-- Déconnexion -->
              <button
                type="button"
                (click)="logout()"
                class="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-xl transition-colors"
                title="Se déconnecter"
              >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span class="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>

          <!-- Onglets Mobiles -->
          <div class="sm:hidden flex space-x-1 py-2 border-t border-stone-100 text-xs font-medium overflow-x-auto">
            <a
              routerLink="/admin/dashboard"
              routerLinkActive="bg-stone-900 text-white"
              class="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-100 whitespace-nowrap"
            >
              Tableau de Bord
            </a>
            <a
              routerLink="/admin/products"
              routerLinkActive="bg-stone-900 text-white"
              class="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-100 whitespace-nowrap"
            >
              Catalogue
            </a>
            <a
              routerLink="/admin/categories"
              routerLinkActive="bg-stone-900 text-white"
              class="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-100 whitespace-nowrap"
            >
              Catégories
            </a>
            <a
              routerLink="/admin/orders"
              routerLinkActive="bg-stone-900 text-white"
              class="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-100 whitespace-nowrap"
            >
              Commandes
            </a>
            <a
              routerLink="/admin/wholesale"
              routerLinkActive="bg-stone-900 text-white"
              class="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-100 whitespace-nowrap"
            >
              Grossistes B2B
            </a>
          </div>

        </div>
      </div>

      <!-- Main Admin Content Area -->
      <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <router-outlet />
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  readonly authService = inject(AuthService);
  readonly healthService = inject(HealthService);

  getInitials(): string {
    const name = this.authService.userName();
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
