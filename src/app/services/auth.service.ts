import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthUser, LoginRequest, RegisterRequest, WholesaleRegistrationRequest, WholesaleRequestDTO } from '../models/auth.model';

const STORAGE_KEY = 'aura_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly adminWholesaleUrl = `${environment.apiUrl}/admin/wholesale-requests`;

  readonly currentUser = signal<AuthUser | null>(this.loadFromStorage());

  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin   = computed(() => this.currentUser()?.role === 'ROLE_ADMIN');
  readonly isClient  = computed(() => this.currentUser()?.role === 'ROLE_CLIENT');
  readonly isWholesale = computed(() => 
    this.currentUser()?.role === 'ROLE_WHOLESALE' || this.currentUser()?.wholesaleStatus === 'APPROVED'
  );
  readonly isWholesalePending = computed(() => this.currentUser()?.wholesaleStatus === 'PENDING');
  readonly userName  = computed(() => this.currentUser()?.fullName ?? '');
  readonly companyName = computed(() => this.currentUser()?.companyName ?? '');

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    });
  }

  login(credentials: LoginRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/login`, credentials).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError((err) => {
        const msg = err.error?.error || err.error?.message || 'Email ou mot de passe incorrect.';
        return throwError(() => new Error(msg));
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/register`, data).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError((err) => {
        const msg = err.error?.error || err.error?.message || "Une erreur est survenue lors de l'inscription.";
        return throwError(() => new Error(msg));
      })
    );
  }

  registerWholesale(data: WholesaleRegistrationRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/register-wholesale`, data).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError((err) => {
        const msg = err.error?.error || err.error?.message || "Une erreur est survenue lors de l'enregistrement de votre demande grossiste.";
        return throwError(() => new Error(msg));
      })
    );
  }

  // --- Endpoints Admin pour la gestion des demandes grossistes ---
  getWholesaleRequests(status?: string): Observable<WholesaleRequestDTO[]> {
    const url = status ? `${this.adminWholesaleUrl}?status=${status}` : this.adminWholesaleUrl;
    return this.http.get<WholesaleRequestDTO[]>(url);
  }

  approveWholesale(id: number): Observable<WholesaleRequestDTO> {
    return this.http.put<WholesaleRequestDTO>(`${this.adminWholesaleUrl}/${id}/approve`, {});
  }

  rejectWholesale(id: number): Observable<WholesaleRequestDTO> {
    return this.http.put<WholesaleRequestDTO>(`${this.adminWholesaleUrl}/${id}/reject`, {});
  }

  logout(): void {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.currentUser()?.token ?? null;
  }

  private loadFromStorage(): AuthUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
