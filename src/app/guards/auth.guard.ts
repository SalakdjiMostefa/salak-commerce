import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Guard : Utilisateur connecté (admin ou client) */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

/** Guard : Espace admin uniquement */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }
  // Redirige vers l'accueil si connecté mais pas admin
  if (auth.isLoggedIn()) {
    router.navigate(['/']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
