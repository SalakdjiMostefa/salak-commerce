import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { CategoryDTO } from '../../../models/category.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- En-tête -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="font-serif text-3xl font-light text-stone-900">Catégories & Univers de Soins</h1>
          <p class="text-xs sm:text-sm text-stone-500 mt-1">
            Gérez vos familles botaniques, descriptions et visuels pour structurer le catalogue boutique.
          </p>
        </div>
        <button
          type="button"
          (click)="openCreateModal()"
          class="rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-stone-800 shadow-md transition-all flex items-center justify-center gap-2"
        >
          <svg class="h-4 w-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Créer une Catégorie</span>
        </button>
      </div>

      <!-- Alerte Erreur / Succès -->
      @if (actionFeedback(); as feedback) {
        <div
          class="rounded-2xl p-4 text-xs flex items-center justify-between transition-all"
          [class.bg-emerald-50]="feedback.type === 'success'"
          [class.border]="true"
          [class.border-emerald-200]="feedback.type === 'success'"
          [class.text-emerald-800]="feedback.type === 'success'"
          [class.bg-rose-50]="feedback.type === 'error'"
          [class.border-rose-200]="feedback.type === 'error'"
          [class.text-rose-800]="feedback.type === 'error'"
        >
          <div class="flex items-center gap-2">
            @if (feedback.type === 'success') {
              <svg class="h-4 w-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            } @else {
              <svg class="h-4 w-4 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            <span>{{ feedback.message }}</span>
          </div>
          <button (click)="actionFeedback.set(null)" class="text-stone-400 hover:text-stone-700">✕</button>
        </div>
      }

      <!-- Barre de Recherche & Compteur -->
      <div class="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:w-80">
          <input
            type="text"
            [(ngModel)]="searchFilter"
            placeholder="Rechercher une catégorie..."
            class="w-full rounded-xl border border-stone-200 bg-stone-50/60 py-2 pl-9 pr-3 text-xs text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none"
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="text-xs font-medium text-stone-500">
          <span class="font-bold text-stone-900">{{ filteredCategories().length }}</span> catégorie(s) référencée(s)
        </div>
      </div>

      <!-- TABLEAU DES CATÉGORIES -->
      <div class="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        @if (categoryService.loading() && categoryService.categories().length === 0) {
          <div class="p-12 text-center text-xs text-stone-500 flex flex-col items-center justify-center gap-3">
            <svg class="h-6 w-6 animate-spin text-stone-700" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>Chargement des catégories depuis le serveur...</span>
          </div>
        } @else if (filteredCategories().length === 0) {
          <div class="p-12 text-center text-xs text-stone-500 space-y-3">
            <p>Aucune catégorie trouvée.</p>
            <button
              (click)="openCreateModal()"
              class="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white"
            >
              + Créer la première catégorie
            </button>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-stone-100 bg-stone-50/70 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th class="py-3.5 px-6">Catégorie</th>
                  <th class="py-3.5 px-6">Description</th>
                  <th class="py-3.5 px-6">Soins Associés</th>
                  <th class="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100">
                @for (cat of filteredCategories(); track cat.id) {
                  <tr class="hover:bg-stone-50/50 transition-colors">
                    <!-- Visuel + Nom -->
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3.5">
                        <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100 border border-stone-200">
                          @if (cat.imageUrl) {
                            <img
                              [src]="cat.imageUrl"
                              [alt]="cat.name"
                              class="h-full w-full object-cover"
                            />
                          } @else {
                            <div class="h-full w-full flex items-center justify-center text-stone-400 text-xs">
                              ✦
                            </div>
                          }
                        </div>
                        <div>
                          <div class="font-bold text-stone-900 text-xs sm:text-sm">{{ cat.name }}</div>
                          <div class="text-[11px] font-mono text-stone-400">ID: #{{ cat.id }}</div>
                        </div>
                      </div>
                    </td>

                    <!-- Description -->
                    <td class="py-4 px-6 text-stone-600 max-w-md">
                      <span class="line-clamp-2">{{ cat.description || '—' }}</span>
                    </td>

                    <!-- Soins rattachés -->
                    <td class="py-4 px-6">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-800">
                        {{ getProductCountForCategory(cat.id) }} soin(s)
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        (click)="openEditModal(cat)"
                        class="rounded-lg p-1.5 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                        title="Modifier cette catégorie"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        (click)="deleteTarget.set(cat)"
                        class="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        title="Supprimer cette catégorie"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- MODAL CRÉATION / MODIFICATION CATÉGORIE -->
      @if (modalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div class="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">

            <div class="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 class="font-serif text-2xl font-normal text-stone-900">
                {{ editingCategory() ? 'Modifier la Catégorie' : 'Créer une Catégorie' }}
              </h2>
              <button
                type="button"
                (click)="modalOpen.set(false)"
                class="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <form [formGroup]="categoryForm" (ngSubmit)="onSaveCategory()" class="space-y-4 text-xs">

              <!-- Nom -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Nom de la Catégorie <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="name"
                  placeholder="Ex: Sérums & Huiles Précieuses"
                  class="w-full rounded-xl border border-stone-300 p-3 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                />
                @if (isInvalid('name')) {
                  <p class="mt-1 text-rose-600">Le nom de la catégorie est obligatoire.</p>
                }
              </div>

              <!-- Description -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Description Botanique <span class="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  formControlName="description"
                  placeholder="Présentation des bienfaits et spécificités de cette famille de soins..."
                  class="w-full rounded-xl border border-stone-300 p-3 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                ></textarea>
                @if (isInvalid('description')) {
                  <p class="mt-1 text-rose-600">La description est requise.</p>
                }
              </div>

              <!-- Image URL -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  URL de l'Image / Visuel
                </label>
                <input
                  type="text"
                  formControlName="imageUrl"
                  placeholder="https://images.unsplash.com/photo-..."
                  class="w-full rounded-xl border border-stone-300 p-3 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <!-- Aperçu visuel en direct -->
              @if (categoryForm.get('imageUrl')?.value) {
                <div class="rounded-xl border border-stone-200 p-3 bg-stone-50 flex items-center gap-3">
                  <img
                    [src]="categoryForm.get('imageUrl')?.value"
                    alt="Aperçu"
                    class="h-12 w-12 rounded-lg object-cover border border-stone-300 flex-shrink-0"
                    (error)="onImageError($event)"
                  />
                  <div class="overflow-hidden">
                    <span class="text-[11px] font-semibold text-stone-800 block">Aperçu du visuel</span>
                    <span class="text-[10px] text-stone-400 font-mono truncate block">{{ categoryForm.get('imageUrl')?.value }}</span>
                  </div>
                </div>
              }

              <!-- Boutons action -->
              <div class="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  (click)="modalOpen.set(false)"
                  class="rounded-xl border border-stone-300 px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  [disabled]="isSaving()"
                  class="rounded-xl bg-stone-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-stone-800 shadow-md disabled:opacity-60 flex items-center gap-2"
                >
                  @if (isSaving()) {
                    <svg class="h-4 w-4 animate-spin text-amber-300" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Enregistrement...</span>
                  } @else {
                    <span>{{ editingCategory() ? 'Mettre à jour' : 'Créer la catégorie' }}</span>
                  }
                </button>
              </div>

            </form>
          </div>
        </div>
      }

      <!-- MODAL CONFIRMATION SUPPRESSION -->
      @if (deleteTarget(); as target) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-center">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 class="font-serif text-xl font-medium text-stone-900">Supprimer la catégorie</h3>
            <p class="text-xs text-stone-500 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer la catégorie <span class="font-bold text-stone-900">« {{ target.name }} »</span> ?
              Les soins rattachés ne seront pas supprimés mais détachés de cette catégorie.
            </p>
            <div class="pt-2 flex justify-center gap-3">
              <button
                type="button"
                (click)="deleteTarget.set(null)"
                class="rounded-xl border border-stone-300 px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Annuler
              </button>
              <button
                type="button"
                (click)="onExecuteDelete()"
                class="rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-rose-700 shadow-md"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class AdminCategoriesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly categoryService = inject(CategoryService);
  readonly productService = inject(ProductService);

  readonly modalOpen = signal<boolean>(false);
  readonly editingCategory = signal<CategoryDTO | null>(null);
  readonly deleteTarget = signal<CategoryDTO | null>(null);
  readonly isSaving = signal<boolean>(false);
  readonly actionFeedback = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  searchFilter = '';
  categoryForm!: FormGroup;

  readonly filteredCategories = computed(() => {
    let list = this.categoryService.categories();
    if (this.searchFilter.trim()) {
      const q = this.searchFilter.toLowerCase().trim();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
    }
    return list;
  });

  ngOnInit(): void {
    this.initForm();
    this.categoryService.loadCategories();
    if (this.productService.products().length === 0) {
      this.productService.loadProducts();
    }
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['']
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.categoryForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  openCreateModal(): void {
    this.editingCategory.set(null);
    this.categoryForm.reset({
      name: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
    });
    this.modalOpen.set(true);
  }

  openEditModal(cat: CategoryDTO): void {
    this.editingCategory.set(cat);
    this.categoryForm.patchValue({
      name: cat.name,
      description: cat.description,
      imageUrl: cat.imageUrl || ''
    });
    this.modalOpen.set(true);
  }

  getProductCountForCategory(categoryId: number): number {
    return this.productService.products().filter((p) => {
      if (typeof p.category === 'object' && p.category !== null) {
        return (p.category as any).id === categoryId;
      }
      return p.category === categoryId;
    }).length;
  }

  onSaveCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValue = this.categoryForm.value;
    const editing = this.editingCategory();

    if (editing) {
      this.categoryService.updateCategory(editing.id, formValue).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.modalOpen.set(false);
          this.actionFeedback.set({ type: 'success', message: `La catégorie « ${formValue.name} » a été modifiée avec succès.` });
          setTimeout(() => this.actionFeedback.set(null), 4000);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.actionFeedback.set({ type: 'error', message: err.message || 'Erreur lors de la mise à jour de la catégorie.' });
        }
      });
    } else {
      this.categoryService.createCategory(formValue).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.modalOpen.set(false);
          this.actionFeedback.set({ type: 'success', message: `La catégorie « ${formValue.name} » a été créée avec succès.` });
          setTimeout(() => this.actionFeedback.set(null), 4000);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.actionFeedback.set({ type: 'error', message: err.message || 'Erreur lors de la création de la catégorie.' });
        }
      });
    }
  }

  onExecuteDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.categoryService.deleteCategory(target.id).subscribe({
      next: () => {
        this.deleteTarget.set(null);
        this.actionFeedback.set({ type: 'success', message: `La catégorie « ${target.name} » a été supprimée.` });
        setTimeout(() => this.actionFeedback.set(null), 4000);
      },
      error: (err) => {
        this.deleteTarget.set(null);
        this.actionFeedback.set({ type: 'error', message: err.message || 'Erreur lors de la suppression.' });
      }
    });
  }
}
