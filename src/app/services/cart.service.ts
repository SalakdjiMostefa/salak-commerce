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

  readonly items = signal<CartItem[]>(this.loadCartFromStorage());
  readonly lastAddedProduct = signal<{ product: ProductDTO; timestamp: number } | null>(null);

  readonly totalCount = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((acc, item) => {
      const price = (item.isWholesale && item.product.wholesalePrice)
        ? item.product.wholesalePrice
        : item.product.price;
      return acc + (price * item.quantity);
    }, 0)
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
    effect(() => {
      this.saveCartToStorage(this.items());
    });
  }

  getItemPrice(item: CartItem): number {
    if (item.isWholesale && item.product.wholesalePrice) {
      return item.product.wholesalePrice;
    }
    return item.product.price;
  }

  addToCart(product: ProductDTO, quantity: number = 1, isWholesale: boolean = false): void {
    if (quantity <= 0) return;

    this.items.update((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) => item.product.id === product.id && !!item.isWholesale === !!isWholesale
      );

      if (existingIndex > -1) {
        return currentItems.map((item, index) => {
          if (index === existingIndex) {
            const newQty = item.quantity + quantity;
            const finalQty = product.stock ? Math.min(newQty, product.stock) : newQty;
            return { ...item, quantity: finalQty };
          }
          return item;
        });
      } else {
        const initialQty = product.stock ? Math.min(quantity, product.stock) : quantity;
        return [...currentItems, { product, quantity: initialQty, isWholesale }];
      }
    });

    this.lastAddedProduct.set({ product, timestamp: Date.now() });
  }

  updateQuantity(productId: number, quantity: number, isWholesale?: boolean): void {
    if (quantity <= 0) {
      this.removeFromCart(productId, isWholesale);
      return;
    }

    this.items.update((currentItems) =>
      currentItems.map((item) => {
        if (item.product.id === productId && (isWholesale === undefined || !!item.isWholesale === !!isWholesale)) {
          const maxStock = item.product.stock;
          const safeQty = maxStock ? Math.min(quantity, maxStock) : quantity;
          return { ...item, quantity: safeQty };
        }
        return item;
      })
    );
  }

  removeFromCart(productId: number, isWholesale?: boolean): void {
    this.items.update((currentItems) =>
      currentItems.filter((item) => 
        !(item.product.id === productId && (isWholesale === undefined || !!item.isWholesale === !!isWholesale))
      )
    );
  }

  clearCart(): void {
    this.items.set([]);
  }

  hasItem(productId: number): boolean {
    return this.items().some((item) => item.product.id === productId);
  }

  getItemQuantity(productId: number): number {
    const found = this.items().find((item) => item.product.id === productId);
    return found ? found.quantity : 0;
  }

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
      // Ignorer
    }
  }
}
