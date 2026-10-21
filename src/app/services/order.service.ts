import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderDTO, CreateOrderDTO, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  // Aucun mock en dur : initialisation à vide et chargement 100% dynamique depuis le backend
  readonly orders = signal<OrderDTO[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  createOrder(order: CreateOrderDTO | Partial<OrderDTO>): Observable<OrderDTO> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<OrderDTO>(this.apiUrl, order).pipe(
      tap((createdOrder) => {
        this.orders.update((list) => [createdOrder, ...list]);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        const msg = err.error?.message || err.message || 'Impossible d’enregistrer la commande auprès du backend.';
        this.error.set(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  getOrders(): Observable<OrderDTO[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<OrderDTO[]>(this.apiUrl).pipe(
      tap((orders) => {
        this.orders.set(orders || []);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        const msg = err.error?.message || err.message || 'Erreur lors de la récupération des commandes.';
        this.error.set(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  loadOrders(): void {
    this.getOrders().subscribe({
      next: () => {},
      error: (err) => console.error('Erreur chargement commandes backend:', err)
    });
  }

  updateOrderStatus(id: number, status: OrderStatus | string): Observable<OrderDTO> {
    this.loading.set(true);
    return this.http.put<OrderDTO>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      tap((updated) => {
        this.orders.update((list) =>
          list.map((order) =>
            order.id === id ? { ...order, status: status as OrderStatus } : order
          )
        );
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }
}
