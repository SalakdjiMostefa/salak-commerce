import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <!-- Bandeau Annonce Supérieur Luxe -->
    <div class="bg-stone-900 text-stone-200 text-[11px] sm:text-xs py-2 px-3 sm:px-4 text-center font-light flex items-center justify-center gap-2 overflow-hidden select-none">
      <span class="inline-block text-amber-300 text-[10px]">✦</span>
      <span class="truncate">{{ ts.t('nav.announcement') }}</span>
      <span class="inline-block text-amber-300 text-[10px]">✦</span>
    </div>

    <!-- Header & Navigation Principale -->
    <header class="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md transition-all shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
      <div class="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">

        <!-- Mobile: Burger Menu Toggle -->
        <div class="flex items-center lg:hidden">
          <button
            type="button"
            (click)="mobileMenuOpen.set(!mobileMenuOpen())"
            class="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none"
            [attr.aria-label]="mobileMenuOpen() ? ts.t('nav.menu_close') : ts.t('nav.menu_open')"
          >
            @if (mobileMenuOpen()) {
              <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            } @else {
              <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          </button>
        </div>

        <!-- Logo SALAKOMERCE Luxury Emblem -->
        <div class="flex items-center">
          <a routerLink="/" class="group flex items-center gap-2 sm:gap-2.5 select-none">
            <!-- Emblème Monogramme Luxe "S" -->
            <div class="relative flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 p-1 sm:p-2 shadow-sm ring-1 ring-amber-400/35 group-hover:ring-amber-400/70 group-hover:scale-105 transition-all duration-300">
              <svg class="h-full w-full text-amber-300" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Facette Diamant Royale -->
                <path d="M24 4L42 24L24 44L6 24L24 4Z" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.35"/>
                <!-- Monogramme "S" Élégant & Volute Botanique -->
                <path d="M30 15C29 13.2 26 12 23 12.5C19 13.2 17.5 16.5 18.5 20C19.8 24 28.5 24.5 29.2 28.5C29.8 32.5 26 35 21.8 35C18 35 15.5 33 14.5 30.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="24" cy="4" r="1.5" fill="currentColor"/>
                <circle cx="24" cy="44" r="1.5" fill="currentColor"/>
              </svg>
              <!-- Étincelle dorée -->
              <span class="absolute -top-0.5 -right-0.5 rtl:-right-auto rtl:-left-0.5 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-amber-400 animate-pulse"></span>
            </div>

            <!-- Typographie Haute Couture -->
            <div class="flex flex-col">
              <span class="font-serif text-lg sm:text-2xl font-bold brand-latin tracking-[0.14em] sm:tracking-[0.16em] text-stone-900 group-hover:text-amber-900 transition-colors leading-tight">
                SALAK<span class="font-light text-amber-800">OMERCE</span>
              </span>
              <span class="hidden sm:flex text-[8px] sm:text-[8.5px] brand-latin tracking-[0.28em] sm:tracking-[0.32em] uppercase text-stone-500 font-semibold -mt-0.5 items-center gap-1">
                <span>HAUTE BEAUTÉ</span>
                <span class="text-amber-500 font-normal">✦</span>
                <span>PARIS</span>
              </span>
            </div>
          </a>
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-3 xl:gap-6 text-sm font-medium text-stone-600">
          <a
            routerLink="/"
            routerLinkActive="text-stone-950 font-semibold bg-stone-100/90 shadow-xs"
            [routerLinkActiveOptions]="{ exact: true }"
            class="px-3.5 py-1.5 rounded-full transition-all hover:text-stone-950 hover:bg-stone-50"
          >
            {{ ts.t('nav.home') }}
          </a>
          <a
            routerLink="/catalog"
            routerLinkActive="text-stone-950 font-semibold bg-stone-100/90 shadow-xs"
            [routerLinkActiveOptions]="{ exact: false }"
            class="px-3.5 py-1.5 rounded-full transition-all hover:text-stone-950 hover:bg-stone-50"
          >
            {{ ts.t('nav.catalog') }}
          </a>
          <a
            routerLink="/favorites"
            routerLinkActive="text-stone-950 font-semibold bg-stone-100/90 shadow-xs"
            class="px-3.5 py-1.5 rounded-full transition-all hover:text-stone-950 hover:bg-stone-50"
          >
            {{ ts.t('nav.favorites') }}
          </a>
          @if (authService.isAdmin()) {
            <a
              routerLink="/admin/dashboard"
              routerLinkActive="text-amber-900 font-bold bg-amber-100 ring-1 ring-amber-300"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 hover:bg-amber-100 transition-all border border-amber-200/60 shadow-xs"
            >
              <svg class="h-3.5 w-3.5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ ts.t('nav.admin') }}</span>
            </a>
          }
        </nav>

        <!-- Right Side: Search + Language Switcher + Favorites + Cart + USER AUTH -->
        <div class="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
          <!-- Desktop Search Input (RTL and LTR mirrored) -->
          <div class="relative hidden md:block w-36 lg:w-44 xl:w-56">
            <form (ngSubmit)="onSearchSubmit()">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                name="search"
                [placeholder]="ts.t('nav.search_placeholder')"
                class="w-full rounded-full border border-stone-200 bg-stone-50/90 py-1.5 sm:py-2 pl-9 pr-4 rtl:pl-4 rtl:pr-9 text-xs text-stone-800 placeholder-stone-400 focus:border-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
              />
              <button
                type="submit"
                class="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                [attr.aria-label]="ts.t('nav.search_label')"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          <!-- Language Switcher Pill FR / عربي -->
          <div class="flex items-center rounded-full border border-stone-200 bg-stone-100/90 p-0.5 text-xs font-semibold text-stone-700 shadow-xs">
            <button
              type="button"
              (click)="ts.setLanguage('fr')"
              class="rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] transition-all brand-latin"
              [ngClass]="ts.isFrench() ? 'bg-stone-900 text-white shadow-sm font-bold' : 'text-stone-500 hover:text-stone-900'"
              title="Passer en Français"
            >
              FR
            </button>
            <button
              type="button"
              (click)="ts.setLanguage('ar')"
              class="rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] transition-all font-sans"
              [ngClass]="ts.isArabic() ? 'bg-amber-800 text-white shadow-sm font-bold' : 'text-stone-500 hover:text-stone-900'"
              title="التحويل إلى العربية"
            >
              عربي
            </button>
          </div>

          <!-- Mobile Search Toggle -->
          <button
            type="button"
            (click)="mobileSearchOpen.set(!mobileSearchOpen())"
            class="md:hidden flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 transition-colors"
            [attr.aria-label]="ts.t('nav.search_label')"
          >
            <svg class="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Favorites Link with Badge -->
          <a
            routerLink="/favorites"
            class="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 hover:text-rose-600 transition-colors"
            [attr.aria-label]="ts.t('nav.favorites')"
          >
            <svg class="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            @if (favoriteService.count() > 0) {
              <span class="absolute -top-0.5 -right-0.5 rtl:-right-auto rtl:-left-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs animate-pulse">
                {{ favoriteService.count() }}
              </span>
            }
          </a>

          <!-- Cart Link with Badge & Counter -->
          <a
            routerLink="/cart"
            class="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-stone-800 hover:bg-stone-100 transition-colors"
            [attr.aria-label]="ts.t('nav.cart')"
          >
            <svg class="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            @if (cartService.totalCount() > 0) {
              <span class="absolute -top-0.5 -right-0.5 rtl:-right-auto rtl:-left-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-stone-900 px-1 text-[10px] font-bold text-white shadow-xs">
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
              class="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-stone-50/80 hover:bg-stone-900 hover:text-white hover:border-stone-900 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-stone-800 transition-all shadow-xs"
              [title]="ts.t('nav.login')"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="hidden md:inline">{{ ts.t('nav.login') }}</span>
            </a>
          } @else {
            <!-- État CONNECTÉ : Menu déroulant Profil Privilège -->
            <div class="relative">
              <button
                type="button"
                (click)="userMenuOpen.set(!userMenuOpen())"
                class="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-amber-200 bg-amber-50/80 py-1 px-1.5 sm:pe-2.5 text-xs font-medium text-stone-800 hover:bg-amber-100 transition-all shadow-xs"
                [attr.aria-expanded]="userMenuOpen()"
                [attr.aria-label]="ts.t('nav.my_account')"
              >
                <!-- Avatar Initials -->
                <span class="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-amber-300 shadow-inner">
                  {{ getUserInitials() }}
                </span>
                <span class="hidden md:inline font-semibold max-w-[85px] truncate text-stone-900">
                  {{ authService.userName() || ts.t('nav.my_account') }}
                </span>
                @if (authService.isAdmin()) {
                  <span class="hidden lg:inline-block px-1.5 py-0.5 text-[9px] uppercase font-bold bg-amber-800 text-white rounded">
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

              <!-- Dropdown Menu Flottant (Positionnement RTL et LTR sécurisé) -->
              @if (userMenuOpen()) {
                <!-- Backdrop invisible pour fermer au clic extérieur -->
                <div class="fixed inset-0 z-40" (click)="userMenuOpen.set(false)"></div>

                <div
                  class="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-72 sm:w-80 rounded-2xl border border-stone-200 bg-white p-3 shadow-2xl shadow-stone-900/10 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <!-- En-tête profil -->
                  <div class="p-2.5 bg-stone-50 rounded-xl mb-2 border border-stone-100 text-left rtl:text-right">
                    <div class="flex items-center gap-3">
                      <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-amber-300 shadow">
                        {{ getUserInitials() }}
                      </span>
                      <div class="overflow-hidden min-w-0 flex-1">
                        <p class="text-xs font-bold text-stone-900 truncate">{{ authService.userName() }}</p>
                        <p class="text-[11px] text-stone-500 truncate font-mono">{{ authService.currentUser()?.email }}</p>
                      </div>
                    </div>
                    <div class="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
                      @if (authService.isAdmin()) {
                        <span class="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                          <span>✦</span> {{ ts.t('nav.admin_studio') }}
                        </span>
                      } @else {
                        <span class="inline-flex items-center gap-1 font-semibold text-stone-700 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                          <span>✦</span> {{ ts.t('nav.member_privilege') }}
                        </span>
                      }
                      <span class="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {{ ts.t('nav.online') }}
                      </span>
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
                          <svg class="h-4 w-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{{ ts.t('nav.admin_studio') }}</span>
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
                        <span>{{ ts.t('nav.my_favorites') }}</span>
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
                        <span>{{ ts.t('nav.my_cart') }}</span>
                      </span>
                      <span class="text-[11px] text-stone-500 font-medium">
                        {{ cartService.totalCount() }} {{ ts.t('nav.items_suffix') }}
                      </span>
                    </a>
                  </div>

                  <!-- Déconnexion -->
                  <div class="pt-2 mt-2 border-t border-stone-100">
                    <button
                      type="button"
                      (click)="logout()"
                      class="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left rtl:text-right"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>{{ ts.t('nav.logout') }}</span>
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
        <div class="border-t border-stone-200 bg-stone-50/95 p-3 sm:p-4 md:hidden animate-in fade-in duration-150">
          <form (ngSubmit)="onSearchSubmit()">
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                name="mobileSearch"
                [placeholder]="ts.t('nav.search_placeholder')"
                class="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-xs sm:text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
                autofocus
              />
              <button
                type="submit"
                class="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                [attr.aria-label]="ts.t('nav.search_label')"
              >
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
        <div class="border-t border-stone-200 bg-white px-5 py-6 lg:hidden shadow-xl animate-in slide-in-from-top-2 duration-200 space-y-4 max-h-[85vh] overflow-y-auto">

          <!-- Section Utilisateur Mobile -->
          @if (authService.isLoggedIn()) {
            <div class="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-left rtl:text-right">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-amber-300">
                    {{ getUserInitials() }}
                  </span>
                  <div class="overflow-hidden min-w-0">
                    <span class="text-xs font-bold text-stone-900 block truncate">{{ authService.userName() }}</span>
                    <span class="text-[10px] text-stone-500 font-mono block truncate">{{ authService.currentUser()?.email }}</span>
                  </div>
                </div>
                @if (authService.isAdmin()) {
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-800 text-white flex-shrink-0">Admin</span>
                }
              </div>

              <div class="mt-3 pt-2.5 border-t border-stone-200 flex justify-between items-center text-xs">
                @if (authService.isAdmin()) {
                  <a
                    routerLink="/admin/dashboard"
                    (click)="mobileMenuOpen.set(false)"
                    class="font-semibold text-amber-800 hover:underline"
                  >
                    {{ ts.t('nav.access_admin') }}
                  </a>
                } @else {
                  <span class="text-stone-500 text-[11px]">{{ ts.t('nav.member_privilege') }}</span>
                }
                <button
                  type="button"
                  (click)="logout()"
                  class="font-semibold text-rose-600 hover:text-rose-800"
                >
                  {{ ts.t('nav.logout') }}
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
              <span>{{ ts.t('nav.login') }}</span>
            </a>
          }

          <!-- Sélecteur de Langue Mobile Dédié -->
          <div class="p-3 bg-stone-100/70 rounded-2xl flex items-center justify-between">
            <span class="text-xs font-semibold text-stone-600">{{ ts.t('nav.language') }}</span>
            <div class="flex items-center rounded-full border border-stone-200 bg-white p-0.5 text-xs font-semibold shadow-xs">
              <button
                type="button"
                (click)="ts.setLanguage('fr')"
                class="rounded-full px-3 py-1 transition-all brand-latin"
                [ngClass]="ts.isFrench() ? 'bg-stone-900 text-white shadow-sm font-bold' : 'text-stone-500 hover:text-stone-900'"
              >
                FR Français
              </button>
              <button
                type="button"
                (click)="ts.setLanguage('ar')"
                class="rounded-full px-3 py-1 transition-all font-sans"
                [ngClass]="ts.isArabic() ? 'bg-amber-800 text-white shadow-sm font-bold' : 'text-stone-500 hover:text-stone-900'"
              >
                العربية AR
              </button>
            </div>
          </div>

          <!-- Liens de navigation mobile -->
          <div class="flex flex-col space-y-1 pt-1 text-left rtl:text-right">
            <a
              routerLink="/"
              (click)="mobileMenuOpen.set(false)"
              class="flex items-center justify-between text-sm sm:text-base font-medium text-stone-800 hover:text-stone-950 py-2 px-3 rounded-xl hover:bg-stone-50 transition-colors"
            >
              <span>{{ ts.t('nav.home') }}</span>
            </a>
            <a
              routerLink="/catalog"
              (click)="mobileMenuOpen.set(false)"
              class="flex items-center justify-between text-sm sm:text-base font-medium text-stone-800 hover:text-stone-950 py-2 px-3 rounded-xl hover:bg-stone-50 transition-colors"
            >
              <span>{{ ts.t('nav.catalog') }}</span>
            </a>
            <a
              routerLink="/favorites"
              (click)="mobileMenuOpen.set(false)"
              class="flex items-center justify-between text-sm sm:text-base font-medium text-stone-800 hover:text-stone-950 py-2 px-3 rounded-xl hover:bg-stone-50 transition-colors"
            >
              <span>{{ ts.t('nav.favorites') }}</span>
              @if (favoriteService.count() > 0) {
                <span class="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                  {{ favoriteService.count() }}
                </span>
              }
            </a>
            <a
              routerLink="/cart"
              (click)="mobileMenuOpen.set(false)"
              class="flex items-center justify-between text-sm sm:text-base font-medium text-stone-800 hover:text-stone-950 py-2 px-3 rounded-xl hover:bg-stone-50 transition-colors"
            >
              <span>{{ ts.t('nav.cart') }}</span>
              <span class="rounded-full bg-stone-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                {{ cartService.totalCount() }} • {{ cartService.total().toFixed(2) }} €
              </span>
            </a>
            @if (authService.isAdmin()) {
              <div class="pt-2 border-t border-stone-100">
                <a
                  routerLink="/admin/dashboard"
                  (click)="mobileMenuOpen.set(false)"
                  class="flex items-center gap-2 text-sm font-semibold text-amber-800 bg-amber-50 p-3 rounded-xl hover:bg-amber-100 transition-colors"
                >
                  <svg class="h-4 w-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ ts.t('nav.admin') }}</span>
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
  readonly ts = inject(TranslationService);
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
