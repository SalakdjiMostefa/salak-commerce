import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PingResponse {
  status: string;
  service: string;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly http = inject(HttpClient);
  private readonly pingUrl = `${environment.apiUrl}/ping`;

  readonly isOnline = signal<boolean | null>(null);
  readonly latencyMs = signal<number | null>(null);
  readonly lastPingTime = signal<Date | null>(null);
  readonly isPinging = signal<boolean>(false);
  readonly pingDetails = signal<PingResponse | null>(null);

  constructor() {
    this.ping().subscribe();
  }

  ping(): Observable<PingResponse | null> {
    this.isPinging.set(true);
    const start = performance.now();

    return this.http.get<PingResponse>(this.pingUrl).pipe(
      tap((res) => {
        const latency = Math.round(performance.now() - start);
        this.latencyMs.set(latency);
        this.isOnline.set(true);
        this.lastPingTime.set(new Date());
        this.pingDetails.set(res);
        this.isPinging.set(false);
      }),
      catchError(() => {
        this.isOnline.set(false);
        this.latencyMs.set(null);
        this.lastPingTime.set(new Date());
        this.pingDetails.set(null);
        this.isPinging.set(false);
        return of(null);
      })
    );
  }
}
