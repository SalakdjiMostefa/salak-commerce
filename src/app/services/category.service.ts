import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoryDTO } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  // Aucun mock en dur : initialisation à vide et chargement 100% dynamique depuis le backend
  readonly categories = signal<CategoryDTO[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  getCategories(): Observable<CategoryDTO[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<CategoryDTO[]>(this.apiUrl).pipe(
      tap((categories) => {
        this.categories.set(categories || []);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        const msg = err.error?.message || err.message || 'Impossible de récupérer les catégories depuis le backend.';
        this.error.set(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  loadCategories(): void {
    this.getCategories().subscribe({
      next: () => {},
      error: (err) => console.error('Erreur chargement catégories backend:', err)
    });
  }

  getCategoryById(id: number): CategoryDTO | undefined {
    return this.categories().find((cat) => cat.id === id);
  }

  createCategory(category: Partial<CategoryDTO>): Observable<CategoryDTO> {
    this.loading.set(true);
    return this.http.post<CategoryDTO>(this.apiUrl, category).pipe(
      tap((created) => {
        this.categories.update((list) => [...list, created]);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  updateCategory(id: number, category: Partial<CategoryDTO>): Observable<CategoryDTO> {
    this.loading.set(true);
    return this.http.put<CategoryDTO>(`${this.apiUrl}/${id}`, category).pipe(
      tap((updated) => {
        this.categories.update((list) =>
          list.map((cat) => (cat.id === id ? updated : cat))
        );
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  deleteCategory(id: number): Observable<void> {
    this.loading.set(true);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.categories.update((list) => list.filter((cat) => cat.id !== id));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }
}
