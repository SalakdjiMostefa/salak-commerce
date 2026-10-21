import { Injectable, signal, computed, effect } from '@angular/core';
import { ProductDTO } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly STORAGE_KEY = 'aura_cosmetics_favorites';

  // Signal contenant la liste des produits favoris
  readonly favorites = signal<ProductDTO[]>(this.loadFavoritesFromStorage());

  // Computeds
  readonly count = computed(() => this.favorites().length);
  readonly isEmpty = computed(() => this.favorites().length === 0);

  constructor() {
    // Synchronisation automatique et réactive dans localStorage
    effect(() => {
      this.saveFavoritesToStorage(this.favorites());
    });
  }

  /**
   * Vérifie si un produit est dans les favoris
   */
  isFavorite(productId: number): boolean {
    return this.favorites().some((fav) => fav.id === productId);
  }

  /**
   * Bascule l'état favori d'un produit (ajoute ou retire)
   * @returns true si le produit a été ajouté, false s'il a été retiré
   */
  toggleFavorite(product: ProductDTO): boolean {
    const exists = this.isFavorite(product.id);
    if (exists) {
      this.removeFavorite(product.id);
      return false;
    } else {
      this.addFavorite(product);
      return true;
    }
  }

  /**
   * Ajoute un produit aux favoris
   */
  addFavorite(product: ProductDTO): void {
    if (!this.isFavorite(product.id)) {
      this.favorites.update((list) => [product, ...list]);
    }
  }

  /**
   * Supprime un produit des favoris
   */
  removeFavorite(productId: number): void {
    this.favorites.update((list) => list.filter((item) => item.id !== productId));
  }

  /**
   * Vide la liste des favoris
   */
  clearFavorites(): void {
    this.favorites.set([]);
  }

  // Persistance localStorage sécurisée
  private loadFavoritesFromStorage(): ProductDTO[] {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return [];
      }
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveFavoritesToStorage(favorites: ProductDTO[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      }
    } catch {
      // Ignorer les erreurs potentielles de quota
    }
  }
}
