import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ProductDTO, ProductStatus, CreateProductDTO } from '../../../models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- En-tête -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="font-serif text-3xl font-light text-stone-900">Catalogue & Gestion des Soins</h1>
          <p class="text-xs sm:text-sm text-stone-500 mt-1">
            Gérez vos fiches produits, niveaux de stocks et tarifications en temps réel.
          </p>
        </div>
        <button
          type="button"
          (click)="openCreateModal()"
          class="rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-stone-800 shadow-md transition-all flex items-center justify-center gap-2"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Créer un Soin</span>
        </button>
      </div>

      <!-- Barre de Recherche et Filtres Table -->
      <div class="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:w-80">
          <input
            type="text"
            [(ngModel)]="searchFilter"
            placeholder="Rechercher par nom, marque..."
            class="w-full rounded-xl border border-stone-200 bg-stone-50/60 py-2 pl-9 pr-3 text-xs text-stone-900 focus:border-stone-900 focus:bg-white focus:outline-none"
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <select
            [(ngModel)]="statusFilter"
            class="rounded-xl border border-stone-300 bg-white py-2 px-3 text-xs font-medium text-stone-700 shadow-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="EN_STOCK">En stock</option>
            <option value="RUPTURE">Rupture</option>
            <option value="NOUVEAU">Nouveau</option>
          </select>

          <span class="text-xs text-stone-500 font-medium">
            {{ filteredProducts().length }} produit(s)
          </span>
        </div>
      </div>

      <!-- TABLEAU DES PRODUITS -->
      <div class="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-stone-100 bg-stone-50/70 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                <th class="py-3 px-6">Produit</th>
                <th class="py-3 px-6">Marque</th>
                <th class="py-3 px-6">Prix</th>
                <th class="py-3 px-6">Stock</th>
                <th class="py-3 px-6">Statut</th>
                <th class="py-3 px-6">Note</th>
                <th class="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              @for (product of filteredProducts(); track product.id) {
                <tr class="hover:bg-stone-50/50 transition-colors">
                  <!-- Produit & Image -->
                  <td class="py-3 px-6">
                    <div class="flex items-center gap-3">
                      <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                        <img
                          [src]="productService.getProductImageUrl(product)"
                          [alt]="product.name"
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div class="font-semibold text-stone-900 text-xs sm:text-sm line-clamp-1">{{ product.name }}</div>
                        <div class="text-[11px] text-stone-400">ID: #{{ product.id }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Marque -->
                  <td class="py-3 px-6 font-medium text-stone-700">
                    {{ product.brand }}
                  </td>

                  <!-- Prix -->
                  <td class="py-3 px-6 font-bold text-stone-900">
                    {{ product.price.toFixed(2) }} €
                  </td>

                  <!-- Stock -->
                  <td class="py-3 px-6">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      [ngClass]="product.stock <= 5 ? 'bg-rose-100 text-rose-700 font-bold' : 'bg-stone-100 text-stone-700'"
                    >
                      {{ product.stock }} unités
                    </span>
                  </td>

                  <!-- Statut -->
                  <td class="py-3 px-6">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                      [ngClass]="{
                        'bg-amber-100 text-amber-800': product.status === 'NOUVEAU',
                        'bg-emerald-100 text-emerald-800': product.status === 'EN_STOCK',
                        'bg-rose-100 text-rose-800': product.status === 'RUPTURE'
                      }"
                    >
                      {{ product.status }}
                    </span>
                  </td>

                  <!-- Note -->
                  <td class="py-3 px-6 font-medium text-stone-700">
                    {{ (product.rating || 5).toFixed(1) }} ★
                  </td>

                  <!-- Actions -->
                  <td class="py-3 px-6 text-right">
                    <div class="inline-flex items-center gap-2">
                      <button
                        type="button"
                        (click)="openEditModal(product)"
                        class="rounded-lg p-1.5 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                        title="Modifier"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        (click)="confirmDelete(product)"
                        class="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Supprimer"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL CRÉATION / MODIFICATION (REACTIVE FORM) -->
      @if (modalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div class="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">

            <div class="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 class="font-serif text-2xl font-medium text-stone-900">
                {{ editingProduct() ? 'Modifier le Soin' : 'Créer un Nouveau Soin' }}
              </h3>
              <button
                type="button"
                (click)="closeModal()"
                class="rounded-lg p-1 text-stone-400 hover:text-stone-700"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form [formGroup]="productForm" (ngSubmit)="onSubmitProduct()" class="space-y-4">

              <!-- Nom & Marque -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Nom du Soin <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="name"
                    class="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Marque <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="brand"
                    class="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Description Botanique & Vertus <span class="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  formControlName="description"
                  class="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                ></textarea>
              </div>

              <!-- Prix, Stock, Note -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Prix (€) <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    formControlName="price"
                    class="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Stock Disponible <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    formControlName="stock"
                    class="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Note Étoiles (0-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    formControlName="rating"
                    class="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <!-- Catégorie & Statut -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Catégorie <span class="text-rose-500">*</span>
                  </label>
                  <select
                    formControlName="category"
                    class="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                  >
                    @for (cat of categoryService.categories(); track cat.id) {
                      <option [value]="cat.id">{{ cat.name }}</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Statut Commercial <span class="text-rose-500">*</span>
                  </label>
                  <select
                    formControlName="status"
                    class="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                  >
                    <option value="EN_STOCK">EN_STOCK</option>
                    <option value="RUPTURE">RUPTURE</option>
                    <option value="NOUVEAU">NOUVEAU</option>
                  </select>
                </div>
              </div>

              <!-- Image URL ou fichier stocké -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  URL Image ou Nom de fichier stocké
                </label>
                <input
                  type="text"
                  formControlName="imageUrl"
                  placeholder="https://... ou nom-du-fichier.jpg"
                  class="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <!-- Actions Modal -->
              <div class="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="rounded-xl border border-stone-300 px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  [disabled]="productForm.invalid || isSaving()"
                  class="rounded-xl bg-stone-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-stone-800 disabled:opacity-50 shadow-md transition-all"
                >
                  {{ isSaving() ? 'Enregistrement...' : 'Enregistrer' }}
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
            <h3 class="font-serif text-xl font-medium text-stone-900">Confirmer la suppression</h3>
            <p class="text-xs text-stone-500 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement le soin <span class="font-bold text-stone-900">« {{ target.name }} »</span> ? Cette action est irréversible.
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
                Supprimer
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly productService = inject(ProductService);
  readonly categoryService = inject(CategoryService);

  readonly modalOpen = signal<boolean>(false);
  readonly editingProduct = signal<ProductDTO | null>(null);
  readonly deleteTarget = signal<ProductDTO | null>(null);
  readonly isSaving = signal<boolean>(false);

  searchFilter = '';
  statusFilter = '';

  productForm!: FormGroup;

  readonly filteredProducts = computed(() => {
    let list = this.productService.products();

    if (this.searchFilter.trim()) {
      const q = this.searchFilter.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    if (this.statusFilter) {
      list = list.filter((p) => p.status === this.statusFilter);
    }

    return list;
  });

  ngOnInit(): void {
    this.initForm();
    if (this.productService.products().length === 0) {
      this.productService.loadProducts();
    }
    if (this.categoryService.categories().length === 0) {
      this.categoryService.loadCategories();
    }
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      brand: ['Maison SALAKOMERCE', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      price: [29.00, [Validators.required, Validators.min(0)]],
      stock: [20, [Validators.required, Validators.min(0)]],
      category: [1, Validators.required],
      status: ['EN_STOCK', Validators.required],
      rating: [5.0, [Validators.min(0), Validators.max(5)]],
      imageUrl: ['']
    });
  }

  openCreateModal(): void {
    this.editingProduct.set(null);
    const firstCat = this.categoryService.categories()[0]?.id || 1;
    this.productForm.reset({
      name: '',
      brand: 'Maison SALAKOMERCE',
      description: '',
      price: 35.00,
      stock: 25,
      category: firstCat,
      status: 'NOUVEAU',
      rating: 5.0,
      imageUrl: ''
    });
    this.modalOpen.set(true);
  }

  openEditModal(product: ProductDTO): void {
    this.editingProduct.set(product);
    let catVal: any = product.category;
    if (typeof catVal === 'object' && catVal !== null) {
      catVal = catVal.id;
    }
    const img = product.images?.[0]?.storedFileName || '';

    this.productForm.patchValue({
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: catVal,
      status: product.status,
      rating: product.rating,
      imageUrl: img
    });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editingProduct.set(null);
  }

  onSubmitProduct(): void {
    if (this.productForm.invalid) return;

    this.isSaving.set(true);
    const formVal = this.productForm.value;

    const images = formVal.imageUrl
      ? [{ originalName: formVal.name, storedFileName: formVal.imageUrl, displayOrder: 1 }]
      : [];

    const payload: any = {
      name: formVal.name,
      brand: formVal.brand,
      description: formVal.description,
      price: Number(formVal.price),
      stock: Number(formVal.stock),
      category: formVal.category,
      status: formVal.status as ProductStatus,
      rating: Number(formVal.rating) || 5.0,
      images: images
    };

    const currentEditing = this.editingProduct();

    if (currentEditing) {
      // Modification PUT /api/products/{id}
      this.productService.updateProduct(currentEditing.id, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
        },
        error: () => {
          // Fallback optimiste si le backend local n'est pas démarré
          this.productService.products.update((list) =>
            list.map((item) =>
              item.id === currentEditing.id ? { ...item, ...payload } : item
            )
          );
          this.isSaving.set(false);
          this.closeModal();
        }
      });
    } else {
      // Création POST /api/products
      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
        },
        error: () => {
          // Fallback optimiste
          const mockNew: ProductDTO = {
            id: Math.floor(Math.random() * 9000) + 1000,
            ...payload
          };
          this.productService.products.update((list) => [mockNew, ...list]);
          this.isSaving.set(false);
          this.closeModal();
        }
      });
    }
  }

  confirmDelete(product: ProductDTO): void {
    this.deleteTarget.set(product);
  }

  onExecuteDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.productService.deleteProduct(target.id).subscribe({
      next: () => {
        this.deleteTarget.set(null);
      },
      error: () => {
        // Fallback optimiste
        this.productService.products.update((list) =>
          list.filter((item) => item.id !== target.id)
        );
        this.deleteTarget.set(null);
      }
    });
  }
}
