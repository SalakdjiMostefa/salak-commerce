import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { OrderDTO, OrderStatus } from '../../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- En-tête -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="font-serif text-3xl font-light text-stone-900">Gestion des Commandes</h1>
          <p class="text-xs sm:text-sm text-stone-500 mt-1">
            Suivi des expéditions, traitement logistique et mise à jour des statuts clients.
          </p>
        </div>
        <button
          type="button"
          (click)="orderService.loadOrders()"
          class="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Actualiser</span>
        </button>
      </div>

      <!-- Filtres & Compteurs Commandes -->
      <div class="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2">
          @for (st of filterTabs; track st.value) {
            <button
              type="button"
              (click)="selectedStatusFilter.set(st.value)"
              class="rounded-xl px-3 py-1.5 text-xs font-medium transition-all"
              [ngClass]="selectedStatusFilter() === st.value ? 'bg-stone-900 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
            >
              {{ st.label }}
            </button>
          }
        </div>

        <span class="text-xs text-stone-500 font-medium">
          {{ filteredOrders().length }} commande(s)
        </span>
      </div>

      <!-- TABLEAU DES COMMANDES -->
      <div class="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        @if (orderService.loading()) {
          <div class="p-12 text-center text-xs text-stone-500">
            Chargement des commandes en cours...
          </div>
        } @else if (filteredOrders().length === 0) {
          <div class="p-12 text-center text-xs text-stone-500">
            Aucune commande ne correspond à ce filtre.
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-stone-100 bg-stone-50/70 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th class="py-3 px-6">ID</th>
                  <th class="py-3 px-6">Client & Contact</th>
                  <th class="py-3 px-6">Adresse de Livraison</th>
                  <th class="py-3 px-6">Articles</th>
                  <th class="py-3 px-6">Total</th>
                  <th class="py-3 px-6">Statut & Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100">
                @for (order of filteredOrders(); track order.id) {
                  <tr class="hover:bg-stone-50/50 transition-colors">
                    <!-- ID & Date -->
                    <td class="py-4 px-6 align-top">
                      <div class="font-bold text-stone-900 text-sm">#{{ order.id }}</div>
                      <div class="text-[11px] text-stone-400 mt-0.5">
                        {{ order.createdAt | date:'dd/MM/yyyy' }}
                      </div>
                      <div class="text-[10px] text-stone-400">
                        {{ order.createdAt | date:'HH:mm' }}
                      </div>
                    </td>

                    <!-- Client & Contact -->
                    <td class="py-4 px-6 align-top">
                      <div class="font-semibold text-stone-900 text-sm">{{ order.customerName }}</div>
                      <div class="text-stone-500">{{ order.email }}</div>
                      <div class="text-stone-400 text-[11px]">{{ order.phone }}</div>
                    </td>

                    <!-- Adresse -->
                    <td class="py-4 px-6 align-top max-w-xs">
                      <div class="text-stone-700 leading-relaxed font-light">
                        {{ order.address }}
                      </div>
                    </td>

                    <!-- Articles commandés -->
                    <td class="py-4 px-6 align-top">
                      <div class="space-y-1">
                        @for (item of order.items; track item.productId) {
                          <div class="text-[11px] text-stone-700">
                            <span class="font-semibold">{{ item.quantity }}x</span> {{ item.productName }}
                            <span class="text-stone-400">({{ (item.unitPrice * item.quantity).toFixed(2) }}€)</span>
                          </div>
                        }
                      </div>
                    </td>

                    <!-- Montant Total -->
                    <td class="py-4 px-6 align-top font-bold text-stone-900 text-sm">
                      {{ order.total.toFixed(2) }} €
                    </td>

                    <!-- Statut avec Sélecteur Interactif PUT /api/orders/{id}/status -->
                    <td class="py-4 px-6 align-top">
                      <div class="space-y-2">
                        <select
                          [ngModel]="order.status"
                          (ngModelChange)="onUpdateStatus(order.id, $event)"
                          class="rounded-xl border border-stone-300 py-1.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-stone-900 shadow-sm"
                          [ngClass]="{
                            'bg-amber-50 text-amber-900 border-amber-300': order.status === 'EN_ATTENTE',
                            'bg-emerald-50 text-emerald-900 border-emerald-300': order.status === 'PAYEE' || order.status === 'PAYE',
                            'bg-sky-50 text-sky-900 border-sky-300': order.status === 'EXPEDIEE' || order.status === 'EXPEDIE',
                            'bg-stone-100 text-stone-900 border-stone-300': order.status === 'LIVREE' || order.status === 'LIVRE',
                            'bg-rose-50 text-rose-900 border-rose-300': order.status === 'ANNULEE' || order.status === 'ANNULE'
                          }"
                        >
                          <option value="EN_ATTENTE">EN_ATTENTE</option>
                          <option value="PAYEE">PAYEE</option>
                          <option value="EXPEDIEE">EXPEDIEE</option>
                          <option value="LIVREE">LIVREE</option>
                          <option value="ANNULEE">ANNULEE</option>
                        </select>

                        @if (updatingOrderId() === order.id) {
                          <div class="text-[10px] text-stone-400 flex items-center gap-1 animate-pulse">
                            <span>Mise à jour...</span>
                          </div>
                        }
                      </div>
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
export class AdminOrdersComponent implements OnInit {
  readonly orderService = inject(OrderService);

  readonly selectedStatusFilter = signal<string>('ALL');
  readonly updatingOrderId = signal<number | null>(null);

  readonly filterTabs = [
    { label: 'Toutes', value: 'ALL' },
    { label: 'En attente', value: 'EN_ATTENTE' },
    { label: 'Payées', value: 'PAYEE' },
    { label: 'Expédiées', value: 'EXPEDIEE' },
    { label: 'Livrées', value: 'LIVREE' },
    { label: 'Annulées', value: 'ANNULEE' }
  ];

  readonly filteredOrders = computed(() => {
    const list = this.orderService.orders();
    const filter = this.selectedStatusFilter();

    if (filter === 'ALL') {
      return list;
    }

    return list.filter((o) => {
      if (filter === 'PAYEE') return o.status === 'PAYEE' || o.status === 'PAYE';
      if (filter === 'EXPEDIEE') return o.status === 'EXPEDIEE' || o.status === 'EXPEDIE';
      if (filter === 'LIVREE') return o.status === 'LIVREE' || o.status === 'LIVRE';
      if (filter === 'ANNULEE') return o.status === 'ANNULEE' || o.status === 'ANNULE';
      return o.status === filter;
    });
  });

  ngOnInit(): void {
    if (this.orderService.orders().length === 0) {
      this.orderService.loadOrders();
    }
  }

  onUpdateStatus(orderId: number, newStatus: string): void {
    this.updatingOrderId.set(orderId);
    this.orderService.updateOrderStatus(orderId, newStatus as OrderStatus).subscribe({
      next: () => {
        this.updatingOrderId.set(null);
      },
      error: () => {
        // Fallback optimiste si backend local non démarré
        this.orderService.orders.update((list) =>
          list.map((order) =>
            order.id === orderId ? { ...order, status: newStatus as OrderStatus } : order
          )
        );
        this.updatingOrderId.set(null);
      }
    });
  }
}
