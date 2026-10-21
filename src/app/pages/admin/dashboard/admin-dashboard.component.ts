import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { HealthService } from '../../../services/health.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      <!-- En-tête -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="font-serif text-3xl font-light text-stone-900">Tableau de Bord Exécutif</h1>
          <p class="text-xs sm:text-sm text-stone-500 mt-1">
            Indicateurs de performance, synchronisation API et alertes stocks de votre boutique SALAKOMERCE.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <a
            routerLink="/admin/products"
            class="rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 shadow-sm transition-all"
          >
            + Nouveau Soin
          </a>
          <a
            routerLink="/admin/orders"
            class="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-sm transition-all"
          >
            Gérer les Commandes
          </a>
        </div>
      </div>

      <!-- SYNCHRONISATION FRONT-BACK & PING EN TEMPS RÉEL -->
      <div
        class="rounded-2xl border p-5 shadow-sm transition-all"
        [class.bg-white]="healthService.isOnline()"
        [class.border-stone-200]="healthService.isOnline()"
        [class.bg-rose-50/50]="healthService.isOnline() === false"
        [class.border-rose-200]="healthService.isOnline() === false"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <!-- Pulsing Status Dot -->
            <div class="relative flex h-3.5 w-3.5 flex-shrink-0">
              @if (healthService.isOnline()) {
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              } @else if (healthService.isOnline() === false) {
                <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
              } @else {
                <span class="animate-pulse relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
              }
            </div>

            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-xs sm:text-sm text-stone-900">
                  @if (healthService.isOnline()) {
                    API Backend Spring Boot Synchronisée (MySQL 8)
                  } @else if (healthService.isOnline() === false) {
                    API Backend Non Détectée (Mode Fallback Démo Actif)
                  } @else {
                    Vérification de la connectivité API...
                  }
                </span>
                <span
                  class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold"
                  [class.bg-emerald-100]="healthService.isOnline()"
                  [class.text-emerald-800]="healthService.isOnline()"
                  [class.bg-rose-100]="healthService.isOnline() === false"
                  [class.text-rose-800]="healthService.isOnline() === false"
                >
                  {{ healthService.isOnline() ? '200 OK — Connecté' : 'Hors-Ligne' }}
                </span>
              </div>
              <p class="text-[11px] text-stone-500 mt-1">
                Service : <span class="font-mono font-medium text-stone-800">{{ healthService.pingDetails()?.service || 'grav_back' }}</span>
                &nbsp;•&nbsp; Port : <span class="font-mono font-medium text-stone-800">8080</span>
                @if (healthService.latencyMs() !== null) {
                  &nbsp;•&nbsp; Latence ping : <span class="font-mono font-bold text-emerald-700">{{ healthService.latencyMs() }} ms</span>
                }
                @if (healthService.lastPingTime(); as time) {
                  &nbsp;•&nbsp; Dernier ping : <span class="text-stone-400 font-mono">{{ time.toLocaleTimeString() }}</span>
                }
              </p>
            </div>
          </div>

          <!-- Bouton de Ping Manuel -->
          <button
            type="button"
            (click)="triggerPing()"
            [disabled]="healthService.isPinging()"
            class="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-stone-800 disabled:opacity-60 transition-all self-start sm:self-auto"
          >
            @if (healthService.isPinging()) {
              <svg class="h-3.5 w-3.5 animate-spin text-amber-300" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>Ping en cours...</span>
            } @else {
              <span class="text-amber-300">✦</span>
              <span>Tester le Ping API Backend</span>
            }
          </button>
        </div>
      </div>

      <!-- CARTES KPI STATISTIQUES -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <!-- KPI 1 : Chiffre d'affaires -->
        <div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-stone-500">Chiffre d'Affaires</span>
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <span class="text-base font-bold">€</span>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-2xl sm:text-3xl font-bold text-stone-900">
              {{ calculatedRevenue().toFixed(2) }} €
            </div>
            <div class="mt-1 flex items-center text-xs text-emerald-600 font-medium">
              <span>↑ 14.2%</span>
              <span class="ml-1 text-stone-400 font-normal">vs mois précédent</span>
            </div>
          </div>
        </div>

        <!-- KPI 2 : Commandes -->
        <div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-stone-500">Total Commandes</span>
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-2xl sm:text-3xl font-bold text-stone-900">
              {{ calculatedOrdersCount() }}
            </div>
            <div class="mt-1 text-xs text-stone-400">
              Transactions enregistrées
            </div>
          </div>
        </div>

        <!-- KPI 3 : Soins au Catalogue -->
        <div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-stone-500">Soins Référencés</span>
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-2xl sm:text-3xl font-bold text-stone-900">
              {{ productService.products().length }}
            </div>
            <div class="mt-1 text-xs text-stone-400">
              Articles actifs au catalogue
            </div>
          </div>
        </div>

        <!-- KPI 4 : Alertes Stock Faible -->
        <div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-stone-500">Alertes Stock</span>
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-2xl sm:text-3xl font-bold" [class.text-rose-600]="lowStockCount() > 0" [class.text-stone-900]="lowStockCount() === 0">
              {{ lowStockCount() }}
            </div>
            <div class="mt-1 text-xs text-stone-400">
              {{ lowStockCount() > 0 ? 'Soins à réapprovisionner' : 'Niveaux de stocks optimaux' }}
            </div>
          </div>
        </div>

      </div>

      <!-- DERNIÈRES COMMANDES RÉCENTES -->
      <div class="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <div class="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 class="font-serif text-lg font-medium text-stone-900">Dernières Commandes Clients</h3>
            <p class="text-xs text-stone-500">Aperçu en temps réel des transactions</p>
          </div>
          <a routerLink="/admin/orders" class="text-xs font-semibold text-stone-900 hover:text-amber-800 underline">
            Voir toutes les commandes →
          </a>
        </div>

        @if (orderService.orders().length === 0) {
          <div class="p-12 text-center text-xs text-stone-500">
            Aucune commande enregistrée pour le moment.
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-stone-200 bg-stone-50/70 text-stone-500 uppercase tracking-wider text-[10px]">
                  <th class="py-3 px-6">ID</th>
                  <th class="py-3 px-6">Client</th>
                  <th class="py-3 px-6">Articles</th>
                  <th class="py-3 px-6">Total Net</th>
                  <th class="py-3 px-6">Date</th>
                  <th class="py-3 px-6">Statut</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100 text-stone-800 font-medium">
                @for (order of recentOrders(); track order.id) {
                  <tr class="hover:bg-stone-50/60 transition-colors">
                    <td class="py-4 px-6 font-mono font-bold text-stone-900">#{{ order.id }}</td>
                    <td class="py-4 px-6">
                      <div class="font-semibold text-stone-900">{{ order.customerName }}</div>
                      <div class="text-[11px] text-stone-400 font-mono">{{ order.email }}</div>
                    </td>
                    <td class="py-4 px-6">
                      <span class="text-stone-600">{{ order.items.length }} soin(s)</span>
                    </td>
                    <td class="py-4 px-6 font-bold text-stone-900">
                      {{ order.total.toFixed(2) }} €
                    </td>
                    <td class="py-4 px-6 text-stone-500 text-[11px]">
                      {{ order.createdAt ? (order.createdAt | date:'dd/MM/yyyy HH:mm') : 'Récemment' }}
                    </td>
                    <td class="py-4 px-6">
                      <span
                        class="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        [class.bg-amber-100]="order.status === 'PAYEE'"
                        [class.text-amber-800]="order.status === 'PAYEE'"
                        [class.bg-blue-100]="order.status === 'EXPEDIEE'"
                        [class.text-blue-800]="order.status === 'EXPEDIEE'"
                        [class.bg-emerald-100]="order.status === 'LIVREE'"
                        [class.text-emerald-800]="order.status === 'LIVREE'"
                        [class.bg-rose-100]="order.status === 'ANNULEE'"
                        [class.text-rose-800]="order.status === 'ANNULEE'"
                      >
                        {{ order.status }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  readonly dashboardService = inject(DashboardService);
  readonly productService = inject(ProductService);
  readonly orderService = inject(OrderService);
  readonly healthService = inject(HealthService);

  readonly calculatedRevenue = computed(() => {
    const fromStats = this.dashboardService.stats()?.totalRevenue;
    if (typeof fromStats === 'number') return fromStats;
    return this.orderService.orders().reduce((acc, o) => acc + (o.total || 0), 0);
  });

  readonly calculatedOrdersCount = computed(() => {
    const fromStats = this.dashboardService.stats()?.totalOrders;
    if (typeof fromStats === 'number') return fromStats;
    return this.orderService.orders().length;
  });

  readonly lowStockCount = computed(() => {
    return this.productService.products().filter((p) => p.stock <= 5).length;
  });

  readonly recentOrders = computed(() => {
    return this.orderService.orders().slice(0, 5);
  });

  ngOnInit(): void {
    this.dashboardService.loadStats();
    if (this.productService.products().length === 0) {
      this.productService.loadProducts();
    }
    if (this.orderService.orders().length === 0) {
      this.orderService.loadOrders();
    }
  }

  triggerPing(): void {
    this.healthService.ping().subscribe();
  }
}
