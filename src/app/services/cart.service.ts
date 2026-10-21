import { Injectable, signal, computed, effect } from '@angular/core';
import { ProductDTO } from '../models/product.model';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'aura_cosmetics_cart';
  readonly FREE_SHIPPING_THRESHOLD = 50;
  readonly STANDARD_SHIPPING_FEE = 4.90;

  // Signal principal stockant les articles
  readonly items = signal<CartItem[]>(this.loadCartFromStorage());

  // Signal indiquant le dernier produit ajouté pour notifications UX
  readonly lastAddedProduct = signal<{ product: ProductDTO; timestamp: number } | null>(null);

  // Computeds réactifs modernes
  readonly totalCount = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  );

  readonly shippingFee = computed(() => {
    const sub = this.subtotal();
    if (sub === 0 || sub >= this.FREE_SHIPPING_THRESHOLD) {
      return 0;
    }
    return this.STANDARD_SHIPPING_FEE;
  });

  readonly freeShippingRemaining = computed(() => {
    const sub = this.subtotal();
    return Math.max(0, this.FREE_SHIPPING_THRESHOLD - sub);
  });

  readonly freeShippingProgress = computed(() => {
    const sub = this.subtotal();
    return Math.min(100, Math.round((sub / this.FREE_SHIPPING_THRESHOLD) * 100));
  });

  readonly total = computed(() => this.subtotal() + this.shippingFee());

  readonly isEmpty = computed(() => this.items().length === 0);

  constructor() {
    // Synchronisation automatique et réactive vers localStorage
    effect(() => {
      this.saveCartToStorage(this.items());
    });
  }

  /**
   * Ajoute un produit au panier ou incrémente sa quantité
   */
  addToCart(product: ProductDTO, quantity: number = 1): void {
    if (quantity <= 0) return;

    this.items.update((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex > -1) {
        return currentItems.map((item, index) => {
          if (index === existingIndex) {
            const newQty = item.quantity + quantity;
            // Respect de la limite du stock si spécifié
            const finalQty = product.stock ? Math.min(newQty, product.stock) : newQty;
            return { ...item, quantity: finalQty };
          }
          return item;
        });
      } else {
        const initialQty = product.stock ? Math.min(quantity, product.stock) : quantity;
        return [...currentItems, { product, quantity: initialQty }];
      }
    });

    this.lastAddedProduct.set({ product, timestamp: Date.now() });
  }

  /**
   * Met à jour la quantité exacte d'un article
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.items.update((currentItems) =>
      currentItems.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock;
          const safeQty = maxStock ? Math.min(quantity, maxStock) : quantity;
          return { ...item, quantity: safeQty };
        }
        return item;
      })
    );
  }

  /**
   * Supprime un article du panier
   */
  removeFromCart(productId: number): void {
    this.items.update((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );
  }

  /**
   * Vide complètement le panier
   */
  clearCart(): void {
    this.items.set([]);
  }

  /**
   * Vérifie si un produit est déjà présent dans le panier
   */
  hasItem(productId: number): boolean {
    return this.items().some((item) => item.product.id === productId);
  }

  /**
   * Récupère la quantité actuelle d'un produit dans le panier
   */
  getItemQuantity(productId: number): number {
    const found = this.items().find((item) => item.product.id === productId);
    return found ? found.quantity : 0;
  }

  // Persistance localStorage sécurisée
  private loadCartFromStorage(): CartItem[] {
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

  private saveCartToStorage(items: CartItem[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      }
    } catch {
      // Ignorer les erreurs potentielles de quota
    }
  }
}
