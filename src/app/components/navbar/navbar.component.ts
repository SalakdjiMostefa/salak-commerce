import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <!-- Bandeau Annonce Supérieur Luxe -->
    <div class="bg-stone-900 text-stone-200 text-[11px] sm:text-xs py-2 px-4 text-center tracking-wider font-light flex items-center justify-center gap-2">
      <span class="inline-block text-amber-300">✦</span>
      <span>Livraison offerte dès 50€ &nbsp;|&nbsp; 3 échantillons prestigieux offerts dans chaque rituel</span>
      <span class="inline-block text-amber-300">✦</span>
    </div>

    <!-- Header & Navigation Principale -->
    <header class="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <!-- Mobile: Burger Menu Toggle -->
        <div class="flex items-center lg:hidden">
          <button
            type="button"
            (click)="mobileMenuOpen.set(!mobileMenuOpen())"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl p-2 text-stone-700 hover:bg-stone-100 transition-colors"
            [attr.aria-label]="mobileMenuOpen() ? 'Fermer le menu' : 'Ouvrir le menu'"
          >
            @if (mobileMenuOpen()) {
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            } @else {
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          </button>
        </div>

        <!-- Logo SALAKOMERCE Luxury Emblem -->
        <div class="flex items-center">
          <a routerLink="/" class="group flex items-center gap-2.5 sm:gap-3 select-none">
            <!-- Emblème Monogramme Luxe "S" -->
            <div class="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 p-1.5 sm:p-2 shadow-md shadow-stone-900/10 ring-1 ring-amber-400/35 group-hover:ring-amber-400/70 group-hover:scale-105 transition-all duration-300">
              <svg class="h-full w-full text-amber-300" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Facette Diamant Royale -->
                <path d="M24 4L42 24L24 44L6 24L24 4Z" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.35"/>
                <!-- Monogramme "S" Élégant & Volute Botanique -->
                <path d="M30 15C29 13.2 26 12 23 12.5C19 13.2 17.5 16.5 18.5 20C19.8 24 28.5 24.5 29.2 28.5C29.8 32.5 26 35 21.8 35C18 35 15.5 33 14.5 30.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="24" cy="4" r="1.5" fill="currentColor"/>
                <circle cx="24" cy="44" r="1.5" fill="currentColor"/>
              </svg>
              <!-- Étincelle dorée scintillante -->
              <span class="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            </div>

            <!-- Typographie Haute Couture -->
            <div class="flex flex-col">
              <span class="font-serif text-xl sm:text-2xl font-semibold tracking-[0.16em] text-stone-900 group-hover:text-amber-900 transition-colors">
                SALAK<span class="font-light text-amber-800">OMERCE</span>
              </span>
              <span class="text-[8px] sm:text-[8.5px] tracking-[0.32em] uppercase text-stone-500 font-semibold -mt-1 flex items-center gap-1">
                <span>HAUTE BEAUTÉ</span>
                <span class="text-amber-500 font-normal">✦</span>
                <span>PARIS</span>
              </span>
            </div>
          </a>
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide text-stone-600">
          <a
            routerLink="/"
            routerLinkActive="text-stone-950 font-semibold border-b-2 border-stone-900"
            [routerLinkActiveOptions]="{ exact: true }"
            class="py-2 transition-colors hover:text-stone-900"
          >
            Accueil
          </a>
          <a
            routerLink="/catalog"
            routerLinkActive="text-stone-950 font-semibold border-b-2 border-stone-900"
            [routerLinkActiveOptions]="{ exact: false }"
            class="py-2 transition-colors hover:text-stone-900"
          >
            Catalogue & Soins
          </a>
          <a
            routerLink="/favorites"
            routerLinkActive="text-stone-950 font-semibold border-b-2 border-stone-900"
            class="py-2 transition-colors hover:text-stone-900"
          >
            Mes Favoris
          </a>
          @if (authService.isAdmin()) {
            <a
              routerLink="/admin/dashboard"
              routerLinkActive="text-amber-900 font-semibold border-b-2 border-amber-800"
              class="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-900 hover:bg-amber-200/80 transition-all shadow-sm"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Espace Admin</span>
            </a>
          }
        </nav>

        <!-- Right Side: Search + Favorites + Cart + USER AUTH -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Desktop Search Input -->
          <div class="relative hidden md:block w-44 lg:w-56">
            <form (ngSubmit)="onSearchSubmit()">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                name="search"
                placeholder="Rechercher un soin..."
                class="w-full rounded-full border border-stone-200 bg-stone-50/80 py-2 pl-9 pr-4 text-xs text-stone-800 placeholder-stone-400 focus:border-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
              />
              <button type="submit" class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700" aria-label="Lancer la recherche">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          <!-- Mobile Search Toggle -->
          <button
            type="button"
            (click)="mobileSearchOpen.set(!mobileSearchOpen())"
            class="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Rechercher"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Favorites Link with Badge -->
          <a
            routerLink="/favorites"
            class="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 hover:text-rose-600 transition-colors"
            aria-label="Voir mes favoris"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            @if (favoriteService.count() > 0) {
              <span class="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm animate-pulse">
                {{ favoriteService.count() }}
              </span>
            }
          </a>

          <!-- Cart Link with Badge & Counter -->
          <a
            routerLink="/cart"
            class="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-800 hover:bg-stone-100 transition-colors"
            aria-label="Voir le panier"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            @if (cartService.totalCount() > 0) {
              <span class="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-stone-900 px-1 text-[10px] font-bold text-white shadow-sm">
                {{ cartService.totalCount() }}
              </span>
            }
          </a>

          <!-- ============================================== -->
          <!-- AUTHENTICATION / ESPACE MEMBRE WIDGET          -->
          <!-- ============================================== -->
          @if (!authService.isLoggedIn()) {
            <!-- État DÉCONNECTÉ : Bouton Connexion Raffiné -->
            <a
              routerLink="/login"
              class="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-stone-50/80 hover:bg-stone-900 hover:text-white hover:border-stone-900 px-3.5 py-1.5 text-xs font-semibold text-stone-800 transition-all shadow-sm"
              title="Se connecter ou créer un compte"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="hidden sm:inline">Connexion</span>
            </a>
          } @else {
            <!-- État CONNECTÉ : Menu déroulant Profil Privilège -->
            <div class="relative">
              <button
                type="button"
                (click)="userMenuOpen.set(!userMenuOpen())"
                class="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 py-1 pl-1 pr-2.5 text-xs font-medium text-stone-800 hover:bg-amber-100 transition-all shadow-sm"
                [attr.aria-expanded]="userMenuOpen()"
                aria-label="Menu du compte"
              >
                <!-- Avatar Initials -->
                <span class="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-amber-300 shadow-inner">
                  {{ getUserInitials() }}
                </span>
                <span class="hidden sm:inline font-semibold max-w-[90px] truncate text-stone-900">
                  {{ authService.userName() || 'Mon Compte' }}
                </span>
                @if (authService.isAdmin()) {
                  <span class="hidden md:inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-amber-800 text-white rounded">
                    Admin
                  </span>
                }
                <svg
                  class="h-3.5 w-3.5 text-stone-500 transition-transform duration-200"
                  [class.rotate-180]="userMenuOpen()"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu Flottant -->
              @if (userMenuOpen()) {
                <!-- Backdrop invisible pour fermer au clic extérieur -->
                <div class="fixed inset-0 z-40" (click)="userMenuOpen.set(false)"></div>

                <div
                  class="absolute right-0 mt-2 w-72 rounded-2xl border border-stone-200 bg-white p-3 shadow-2xl shadow-stone-300/60 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <!-- En-tête profil -->
                  <div class="p-2.5 bg-stone-50 rounded-xl mb-2 border border-stone-100">
                    <div class="flex items-center gap-3">
                      <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-amber-300 shadow">
                        {{ getUserInitials() }}
                      </span>
                      <div class="overflow-hidden">
                        <p class="text-xs font-bold text-stone-900 truncate">{{ authService.userName() }}</p>
                        <p class="text-[11px] text-stone-500 truncate font-mono">{{ authService.currentUser()?.email }}</p>
                      </div>
                    </div>
                    <div class="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
                      @if (authService.isAdmin()) {
                        <span class="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                          <span>✦</span> Studio Administrateur
                        </span>
                      } @else {
                        <span class="inline-flex items-center gap-1 font-semibold text-stone-700 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                          <span>✦</span> Membre Privilège SALAKOMERCE
                        </span>
                      }
                      <span class="text-emerald-700 font-medium">En ligne</span>
                    </div>
                  </div>

                  <!-- Liens d'accès rapide -->
                  <div class="space-y-1 text-xs text-stone-700 font-medium">
                    @if (authService.isAdmin()) {
                      <a
                        routerLink="/admin/dashboard"
                        (click)="userMenuOpen.set(false)"
                        class="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100/90 transition-colors"
                      >
                        <span class="flex items-center gap-2 font-semibold">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Studio d'Administration</span>
                        </span>
                        <span class="text-[10px] font-bold bg-amber-800 text-white px-1.5 py-0.5 rounded">Admin</span>
                      </a>
                    }

                    <a
                      routerLink="/favorites"
                      (click)="userMenuOpen.set(false)"
                      class="flex items-center justify-between p-2 rounded-xl hover:bg-stone-100 transition-colors"
                    >
                      <span class="flex items-center gap-2">
                        <svg class="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Mes Soins Favoris</span>
                      </span>
                      @if (favoriteService.count() > 0) {
                        <span class="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          {{ favoriteService.count() }}
                        </span>
                      }
                    </a>

                    <a
                      routerLink="/cart"
                      (click)="userMenuOpen.set(false)"
                      class="flex items-center justify-between p-2 rounded-xl hover:bg-stone-100 transition-colors"
                    >
                      <span class="flex items-center gap-2">
                        <svg class="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>Mon Panier Actif</span>
                      </span>
                      <span class="text-[11px] text-stone-500 font-medium">
                        {{ cartService.totalCount() }} article(s)
                      </span>
                    </a>
                  </div>

                  <!-- Déconnexion -->
                  <div class="pt-2 mt-2 border-t border-stone-100">
                    <button
                      type="button"
                      (click)="logout()"
                      class="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Mobile Search Bar Expander -->
      @if (mobileSearchOpen()) {
        <div class="border-t border-stone-200 bg-stone-50 p-4 md:hidden">
          <form (ngSubmit)="onSearchSubmit()">
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                name="mobileSearch"
                placeholder="Rechercher une crème, un sérum..."
                class="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
                autofocus
              />
              <button type="submit" class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-label="Valider recherche">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Mobile Menu Drawer -->
      @if (mobileMenuOpen()) {
        <div class="border-t border-stone-200 bg-white px-6 py-6 lg:hidden shadow-xl animate-in slide-in-from-top-2 duration-200 space-y-5">

          <!-- Section Utilisateur Mobile -->
          @if (authService.isLoggedIn()) {
            <div class="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-amber-300">
                    {{ getUserInitials() }}
                  </span>
                  <div>
                    <span class="text-xs font-bold text-stone-900 block">{{ authService.userName() }}</span>
                    <span class="text-[10px] text-stone-500 font-mono block">{{ authService.currentUser()?.email }}</span>
                  </div>
                </div>
                @if (authService.isAdmin()) {
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-800 text-white">Admin</span>
                }
              </div>

              <div class="mt-3 pt-2.5 border-t border-stone-200 flex justify-between items-center text-xs">
                @if (authService.isAdmin()) {
                  <a
                    routerLink="/admin/dashboard"
                    (click)="mobileMenuOpen.set(false)"
                    class="font-semibold text-amber-800 hover:underline"
                  >
                    Accéder à l'Admin →
                  </a>
                } @else {
                  <span class="text-stone-500 text-[11px]">Membre Privilège</span>
                }
                <button
                  type="button"
                  (click)="logout()"
                  class="font-semibold text-rose-600 hover:text-rose-800"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          } @else {
            <a
              routerLink="/login"
              (click)="mobileMenuOpen.set(false)"
              class="flex items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-stone-800 transition-all text-center"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Se connecter / S'inscrire</span>
            </a>
          }

          <!-- Liens de navigation mobile -->
          <div class="flex flex-col space-y-3 pt-1">
            <a
              routerLink="/"
              (click)="mobileMenuOpen.set(false)"
              class="text-base font-medium text-stone-800 hover:text-stone-950 py-1"
            >
              Accueil
            </a>
            <a
              routerLink="/catalog"
              (click)="mobileMenuOpen.set(false)"
              class="text-base font-medium text-stone-800 hover:text-stone-950 py-1"
            >
              Catalogue & Soins
            </a>
            <a
              routerLink="/favorites"
              (click)="mobileMenuOpen.set(false)"
              class="flex items-center justify-between text-base font-medium text-stone-800 hover:text-stone-950 py-1"
            >
              <span>Mes Favoris</span>
              @if (favoriteService.count() > 0) {
                <span class="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                  {{ favoriteService.count() }}
                </span>
              }
            </a>
            <a
              routerLink="/cart"
              (click)="mobileMenuOpen.set(false)"
              class="flex items-center justify-between text-base font-medium text-stone-800 hover:text-stone-950 py-1"
            >
              <span>Mon Panier</span>
              <span class="rounded-full bg-stone-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                {{ cartService.totalCount() }} article(s) • {{ cartService.total().toFixed(2) }} €
              </span>
            </a>
            @if (authService.isAdmin()) {
              <div class="pt-3 border-t border-stone-100">
                <a
                  routerLink="/admin/dashboard"
                  (click)="mobileMenuOpen.set(false)"
                  class="flex items-center gap-2 text-sm font-semibold text-amber-800 bg-amber-50 p-3 rounded-xl hover:bg-amber-100 transition-colors"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Panneau d'Administration</span>
                </a>
              </div>
            }
          </div>
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  readonly cartService = inject(CartService);
  readonly favoriteService = inject(FavoriteService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly mobileMenuOpen = signal<boolean>(false);
  readonly mobileSearchOpen = signal<boolean>(false);
  readonly userMenuOpen = signal<boolean>(false);
  searchQuery = '';

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/catalog'], {
        queryParams: { q: this.searchQuery.trim() }
      });
      this.mobileSearchOpen.set(false);
      this.mobileMenuOpen.set(false);
    }
  }

  getUserInitials(): string {
    const name = this.authService.userName();
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  logout(): void {
    this.userMenuOpen.set(false);
    this.mobileMenuOpen.set(false);
    this.authService.logout();
  }
}
