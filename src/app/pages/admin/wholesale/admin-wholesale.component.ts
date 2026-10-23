import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { TranslationService } from '../../../services/translation.service';
import { WholesaleRequestDTO, WholesaleStatus } from '../../../models/auth.model';

@Component({
  selector: 'app-admin-wholesale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- En-tête Page Admin -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
            Validation des Comptes Grossistes & Revendeurs
          </h1>
          <p class="text-xs sm:text-sm text-stone-500 mt-1">
            Gérez et validez manuellement les demandes des salons, instituts et revendeurs pour leur débloquer les tarifs de gros.
          </p>
        </div>

        <!-- Compteur En Attente -->
        @if (pendingCount() > 0) {
          <div class="inline-flex items-center gap-2 rounded-2xl bg-amber-100/80 px-4 py-2 border border-amber-300 text-amber-900 shadow-xs">
            <span class="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <span class="text-xs font-bold">{{ pendingCount() }} dossier(s) en attente d'approbation</span>
          </div>
        }
      </div>

      <!-- Filtres d'état (Tabs) -->
      <div class="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          type="button"
          (click)="selectedTab.set('PENDING')"
          class="rounded-full px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5"
          [ngClass]="selectedTab() === 'PENDING' ? 'bg-amber-800 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
        >
          <span>En Attente</span>
          @if (pendingCount() > 0) {
            <span class="rounded-full bg-amber-200 text-amber-950 px-1.5 py-0.2 text-[10px]">
              {{ pendingCount() }}
            </span>
          }
        </button>

        <button
          type="button"
          (click)="selectedTab.set('APPROVED')"
          class="rounded-full px-4 py-2 text-xs font-bold transition-all"
          [ngClass]="selectedTab() === 'APPROVED' ? 'bg-stone-900 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
        >
          Grossistes Approuvés ({{ approvedCount() }})
        </button>

        <button
          type="button"
          (click)="selectedTab.set('ALL')"
          class="rounded-full px-4 py-2 text-xs font-bold transition-all"
          [ngClass]="selectedTab() === 'ALL' ? 'bg-stone-900 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
        >
          Toutes les candidatures ({{ requests().length }})
        </button>
      </div>

      <!-- Notification de succès -->
      @if (successMessage()) {
        <div class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center justify-between animate-in fade-in">
          <span>✓ {{ successMessage() }}</span>
          <button type="button" (click)="successMessage.set(null)" class="text-emerald-700 hover:text-emerald-900">✕</button>
        </div>
      }

      <!-- Tableau des Candidatures Grossistes -->
      <div class="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm">
        @if (loading()) {
          <div class="p-12 text-center text-xs text-stone-500">
            <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-stone-800 border-t-transparent mb-2"></span>
            <p>Chargement des demandes grossistes...</p>
          </div>
        } @else if (filteredRequests().length === 0) {
          <div class="p-12 text-center space-y-2">
            <span class="text-3xl text-stone-300">✦</span>
            <p class="text-sm font-semibold text-stone-700">Aucune demande grossiste dans cette catégorie</p>
            <p class="text-xs text-stone-400">Les candidatures des professionnels apparaîtront ici.</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left rtl:text-right border-collapse text-xs">
              <thead>
                <tr class="border-b border-stone-200 bg-stone-50/70 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  <th class="py-3 px-4">Établissement & RC</th>
                  <th class="py-3 px-4">Gérant / Contact</th>
                  <th class="py-3 px-4">Coordonnées</th>
                  <th class="py-3 px-4">Statut</th>
                  <th class="py-3 px-4 text-center">Actions Décisionnelles</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100">
                @for (req of filteredRequests(); track req.id) {
                  <tr class="hover:bg-stone-50/60 transition-colors">

                    <!-- Établissement & RC -->
                    <td class="py-4 px-4">
                      <div class="font-bold text-stone-900 text-sm">
                        {{ req.companyName || 'Société non renseignée' }}
                      </div>
                      <div class="text-[11px] text-stone-500 font-mono mt-0.5">
                        RC / SIRET : <span class="font-bold text-stone-700">{{ req.tradeRegister || 'Non fourni' }}</span>
                      </div>
                      @if (req.businessAddress) {
                        <div class="text-[10px] text-stone-400 truncate max-w-xs mt-0.5">
                          📍 {{ req.businessAddress }}
                        </div>
                      }
                    </td>

                    <!-- Gérant / Responsable -->
                    <td class="py-4 px-4">
                      <div class="font-semibold text-stone-800">{{ req.fullName }}</div>
                      <div class="text-[10px] text-stone-400 mt-0.5">ID Utilisateur : #{{ req.id }}</div>
                    </td>

                    <!-- Coordonnées -->
                    <td class="py-4 px-4 space-y-1">
                      <div class="flex items-center gap-1.5 text-stone-700">
                        <span>✉</span>
                        <a [href]="'mailto:' + req.email" class="hover:underline font-mono">{{ req.email }}</a>
                      </div>
                      @if (req.phone) {
                        <div class="flex items-center gap-1.5 text-stone-600">
                          <span>📞</span>
                          <span class="font-mono">{{ req.phone }}</span>
                        </div>
                      }
                    </td>

                    <!-- Statut -->
                    <td class="py-4 px-4">
                      @switch (req.wholesaleStatus) {
                        @case ('PENDING') {
                          <span class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-900">
                            <span class="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                            En Attente
                          </span>
                        }
                        @case ('APPROVED') {
                          <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-900">
                            <span>✓</span> Grossiste Validé
                          </span>
                        }
                        @case ('REJECTED') {
                          <span class="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-800">
                            <span>✕</span> Refusé
                          </span>
                        }
                        @default {
                          <span class="text-stone-400 font-medium">Particulier</span>
                        }
                      }
                    </td>

                    <!-- Actions Administrateur -->
                    <td class="py-4 px-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                        @if (req.wholesaleStatus !== 'APPROVED') {
                          <button
                            type="button"
                            (click)="approve(req)"
                            class="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition-all shadow-xs"
                            title="Valider et activer les prix grossistes pour ce client"
                          >
                            <span>✓</span>
                            <span>Valider Grossiste</span>
                          </button>
                        }

                        @if (req.wholesaleStatus !== 'REJECTED') {
                          <button
                            type="button"
                            (click)="reject(req)"
                            class="inline-flex items-center gap-1 rounded-xl border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all"
                            title="Rejeter la candidature"
                          >
                            <span>✕</span>
                            <span>Rejeter</span>
                          </button>
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
export class AdminWholesaleComponent implements OnInit {
  private readonly authService = inject(AuthService);
  readonly ts = inject(TranslationService);

  readonly requests = signal<WholesaleRequestDTO[]>([]);
  readonly loading = signal<boolean>(true);
  readonly selectedTab = signal<'ALL' | 'PENDING' | 'APPROVED'>('PENDING');
  readonly successMessage = signal<string | null>(null);

  readonly pendingCount = computed(() =>
    this.requests().filter((r) => r.wholesaleStatus === 'PENDING').length
  );

  readonly approvedCount = computed(() =>
    this.requests().filter((r) => r.wholesaleStatus === 'APPROVED').length
  );

  readonly filteredRequests = computed(() => {
    const tab = this.selectedTab();
    const all = this.requests();
    if (tab === 'PENDING') {
      return all.filter((r) => r.wholesaleStatus === 'PENDING');
    }
    if (tab === 'APPROVED') {
      return all.filter((r) => r.wholesaleStatus === 'APPROVED');
    }
    return all;
  });

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading.set(true);
    this.authService.getWholesaleRequests().subscribe({
      next: (list) => {
        this.requests.set(list || []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  approve(req: WholesaleRequestDTO): void {
    this.authService.approveWholesale(req.id).subscribe({
      next: (updated) => {
        this.requests.update((list) =>
          list.map((r) => (r.id === updated.id ? updated : r))
        );
        this.successMessage.set(`Le compte de "${req.companyName || req.fullName}" est désormais validé comme GROSSISTE !`);
      }
    });
  }

  reject(req: WholesaleRequestDTO): void {
    this.authService.rejectWholesale(req.id).subscribe({
      next: (updated) => {
        this.requests.update((list) =>
          list.map((r) => (r.id === updated.id ? updated : r))
        );
        this.successMessage.set(`La demande de "${req.companyName || req.fullName}" a été rejetée.`);
      }
    });
  }
}
