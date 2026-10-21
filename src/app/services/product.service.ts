import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductDTO, CreateProductDTO } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  // Aucun mock en dur : initialisation à vide et chargement 100% dynamique depuis le backend
  readonly products = signal<ProductDTO[]>([]);
  readonly selectedProduct = signal<ProductDTO | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  private readonly defaultCosmeticImages = [
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556228722-d0b71946ec98?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608248597359-0091871e411b?auto=format&fit=crop&w=800&q=80'
  ];

  getProducts(): Observable<ProductDTO[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<ProductDTO[]>(this.apiUrl).pipe(
      tap((products) => {
        this.products.set(products || []);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        const msg = err.error?.message || err.message || 'Erreur lors de la récupération des produits depuis le backend.';
        this.error.set(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  loadProducts(): void {
    this.getProducts().subscribe({
      next: () => {},
      error: (err) => console.error('Erreur chargement produits backend:', err)
    });
  }

  getProductById(id: number): Observable<ProductDTO> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<ProductDTO>(`${this.apiUrl}/${id}`).pipe(
      tap((product) => {
        this.selectedProduct.set(product);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        const msg = err.error?.message || err.message || 'Soin introuvable sur le serveur.';
        this.error.set(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  createProduct(product: Partial<ProductDTO> | CreateProductDTO): Observable<ProductDTO> {
    this.loading.set(true);
    return this.http.post<ProductDTO>(this.apiUrl, product).pipe(
      tap((created) => {
        this.products.update((list) => [created, ...list]);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  updateProduct(id: number, product: Partial<ProductDTO>): Observable<ProductDTO> {
    this.loading.set(true);
    return this.http.put<ProductDTO>(`${this.apiUrl}/${id}`, product).pipe(
      tap((updated) => {
        this.products.update((list) =>
          list.map((item) => (item.id === id ? { ...item, ...updated } : item))
        );
        if (this.selectedProduct()?.id === id) {
          this.selectedProduct.set(updated);
        }
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    this.loading.set(true);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.products.update((list) => list.filter((item) => item.id !== id));
        if (this.selectedProduct()?.id === id) {
          this.selectedProduct.set(null);
        }
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  getProductImageUrl(product: ProductDTO | null | undefined, index = 0): string {
    if (!product) {
      return this.defaultCosmeticImages[0];
    }

    if (product.images && product.images.length > index) {
      const fileName = product.images[index]?.storedFileName;
      if (fileName) {
        if (fileName.startsWith('http://') || fileName.startsWith('https://') || fileName.startsWith('data:')) {
          return fileName;
        }
        return `${environment.apiUrl}/products/images/${fileName}`;
      }
    }

    const fallbackIndex = Math.abs((product.id || 1) % this.defaultCosmeticImages.length);
    return this.defaultCosmeticImages[fallbackIndex];
  }
}
