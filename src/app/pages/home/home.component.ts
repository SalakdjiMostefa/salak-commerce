import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductDTO } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="relative overflow-hidden">
      <!-- HERO BANNER -->
      <section class="relative bg-gradient-to-b from-stone-100 via-rose-50/30 to-white py-16 sm:py-24 lg:py-32">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

            <!-- Hero Text -->
            <div class="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div class="inline-flex items-center gap-2 rounded-full bg-rose-100/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-rose-900 ring-1 ring-inset ring-rose-200/80">
                <span class="inline-block h-1.5 w-1.5 rounded-full bg-rose-600 animate-ping"></span>
                <span>Nouvelle Collection Botanique 2026</span>
              </div>

              <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-[1.15]">
                L'Éveil de votre éclat, <br />
                <span class="italic font-normal text-amber-900">par la pureté végétale.</span>
              </h1>

              <p class="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
                Une symphonie d'actifs naturels d'exception et de biotechnologie douce.
                Des soins sensoriels d'une infinie pureté, pensés pour régénérer et illuminer votre peau au quotidien.
              </p>

              <!-- CTA Buttons -->
              <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  routerLink="/catalog"
                  class="w-full sm:w-auto rounded-full bg-stone-900 px-8 py-3.5 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-xl hover:bg-stone-800 hover:shadow-2xl transition-all active:scale-95"
                >
                  Explorer la Boutique
                </a>
                <a
                  routerLink="/catalog"
                  [queryParams]="{ filter: 'nouveau' }"
                  class="w-full sm:w-auto rounded-full border border-stone-300 bg-white/80 px-8 py-3.5 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-800 backdrop-blur-sm hover:bg-stone-50 hover:border-stone-400 transition-all active:scale-95"
                >
                  Découvrir les Nouveautés
                </a>
              </div>

              <!-- Reassurance Bullets -->
              <div class="pt-6 border-t border-stone-200/70 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div class="font-serif text-xl sm:text-2xl font-semibold text-stone-900">100%</div>
                  <div class="text-[11px] sm:text-xs text-stone-500 font-light">Formules Clean & Véganes</div>
                </div>
                <div>
                  <div class="font-serif text-xl sm:text-2xl font-semibold text-stone-900">98.7%</div>
                  <div class="text-[11px] sm:text-xs text-stone-500 font-light">Origine Naturelle Certifiée</div>
                </div>
                <div>
                  <div class="font-serif text-xl sm:text-2xl font-semibold text-stone-900">France</div>
                  <div class="text-[11px] sm:text-xs text-stone-500 font-light">Élaboré en Haute Provence</div>
                </div>
              </div>
            </div>

            <!-- Hero Imagery Visual -->
            <div class="lg:col-span-5 relative">
              <div class="relative mx-auto aspect-[4/5] max-w-sm sm:max-w-md overflow-hidden rounded-3xl shadow-2xl ring-1 ring-stone-900/10">
                <img
                  src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80"
                  alt="Soin haute cosmétique naturelle AURA"
                  class="h-full w-full object-cover object-center"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent"></div>
                <div class="absolute bottom-6 left-6 right-6 text-white">
                  <span class="inline-block text-amber-300 text-xs font-semibold uppercase tracking-widest mb-1">Rituel Signature</span>
                  <h3 class="font-serif text-2xl font-normal leading-snug">Élixir Céleste Régénérant</h3>
                  <p class="text-xs text-stone-200 mt-1">Acide hyaluronique pur & extrait de rose sauvage.</p>
                </div>
              </div>

              <!-- Floating Luxury Card Badge -->
              <div class="absolute -bottom-6 -left-4 sm:-left-8 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur-md border border-stone-100 max-w-xs hidden sm:block">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <span class="text-lg">✦</span>
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-stone-900">Note moyenne de 4.9/5</div>
                    <div class="text-[11px] text-stone-500">Par plus de 3 200 clientes comblées</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- CATÉGORIES VEDETTES -->
      <section class="py-16 sm:py-20 bg-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <span class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Nos Univers de Soins</span>
            <h2 class="font-serif text-3xl sm:text-4xl font-normal text-stone-900 mt-2">
              Des collections pensées pour votre peau
            </h2>
            <p class="text-sm text-stone-500 mt-3 font-light">
              Explorez nos routines créées selon les exigences de chaque type d'épiderme.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            @for (cat of featuredCategories; track cat.id) {
              <a
                [routerLink]="['/catalog']"
                [queryParams]="{ category: cat.name }"
                class="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-stone-100 shadow-sm transition-all hover:shadow-xl"
              >
                <img
                  [src]="cat.imageUrl"
                  [alt]="cat.name"
                  class="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-900/20 to-transparent"></div>
                <div class="absolute bottom-4 left-4 right-4 text-white">
                  <h3 class="font-serif text-lg sm:text-xl font-normal group-hover:text-amber-200 transition-colors">
                    {{ cat.name }}
                  </h3>
                  <span class="text-[11px] text-stone-300 font-light flex items-center gap-1 mt-1">
                    Découvrir la sélection
                    <svg class="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- NOUVEAUTÉS & SÉLECTION -->
      <section class="py-16 sm:py-24 bg-stone-50/70 border-t border-stone-200/60">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Dernières Créations</span>
              <h2 class="font-serif text-3xl sm:text-4xl font-normal text-stone-900 mt-2">
                Les Nouveautés de la Maison
              </h2>
            </div>
            <a
              routerLink="/catalog"
              class="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-amber-900 flex items-center gap-1.5 transition-colors"
            >
              <span>Voir tout le catalogue</span>
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <!-- Loading State -->
          @if (productService.loading()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (item of [1, 2, 3, 4]; track item) {
                <div class="animate-pulse rounded-2xl bg-white p-4 border border-stone-200/60 shadow-sm space-y-4">
                  <div class="aspect-square w-full rounded-xl bg-stone-200"></div>
                  <div class="h-4 w-1/3 bg-stone-200 rounded"></div>
                  <div class="h-5 w-3/4 bg-stone-200 rounded"></div>
                  <div class="h-4 w-1/2 bg-stone-200 rounded"></div>
                </div>
              }
            </div>
          } @else if (newProducts().length > 0) {
            <!-- Product Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (prod of newProducts(); track prod.id) {
                <app-product-card [product]="prod" />
              }
            </div>
          } @else {
            <div class="text-center py-12 bg-white rounded-2xl border border-stone-200">
              <p class="text-stone-500 text-sm">Chargement des nouveautés en cours...</p>
            </div>
          }
        </div>
      </section>

      <!-- ÉDITORIAL & SAVOIR-FAIRE -->
      <section class="py-16 sm:py-24 bg-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
                alt="Ingrédients nobles et fabrication artisanale"
                class="h-full w-full object-cover"
              />
            </div>
            <div class="space-y-6">
              <span class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">L'Excellence Botanique</span>
              <h2 class="font-serif text-3xl sm:text-4xl font-normal text-stone-900 leading-snug">
                La nature sublimée par une science d'avant-garde
              </h2>
              <p class="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
                Chaque création AURA est un hommage à la résilience et à la générosité de la flore. Nous sélectionnons des plantes médicinales cueillies à maturité dans le respect des cycles lunaires, puis distillées à basse température pour préserver toute l'énergie de leurs principes actifs.
              </p>
              <div class="pt-2">
                <a
                  routerLink="/catalog"
                  class="inline-flex items-center gap-2 rounded-full border border-stone-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-stone-900 hover:bg-stone-900 hover:text-white transition-all"
                >
                  Découvrir nos rituels de soin
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  readonly productService = inject(ProductService);
  readonly categoryService = inject(CategoryService);

  readonly featuredCategories = [
    {
      id: 1,
      name: 'Sérums & Huiles',
      imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      name: 'Crèmes de Jour & Nuit',
      imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      name: 'Nettoyants & Lotions',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      name: 'Masques & Rituels',
      imageUrl: 'https://images.unsplash.com/photo-1556228722-d0b71946ec98?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Nouveautés ou top 4 produits
  readonly newProducts = computed(() => {
    const list = this.productService.products();
    const nouveau = list.filter((p) => p.status === 'NOUVEAU');
    return nouveau.length > 0 ? nouveau.slice(0, 4) : list.slice(0, 4);
  });

  ngOnInit(): void {
    if (this.productService.products().length === 0) {
      this.productService.loadProducts();
    }
    if (this.categoryService.categories().length === 0) {
      this.categoryService.loadCategories();
    }
  }
}
