import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardStatsDTO } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard/stats`;

  // Aucun mock en dur : données 100% dynamiques provenant de l'API Spring Boot
  readonly stats = signal<DashboardStatsDTO | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  getStats(): Observable<DashboardStatsDTO> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<DashboardStatsDTO>(this.apiUrl).pipe(
      tap((data) => {
        if (data) {
          this.stats.set(data);
        }
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        const msg = err.error?.message || err.message || 'Impossible de récupérer les statistiques du tableau de bord.';
        this.error.set(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  loadStats(): void {
    this.getStats().subscribe({
      next: () => {},
      error: (err) => console.error('Erreur chargement stats dashboard:', err)
    });
  }
}
