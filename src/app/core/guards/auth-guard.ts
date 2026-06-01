import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(Auth);
  const router = inject(Router);

  // Si se está ejecutando en el servidor (SSR), permitir para evitar redirecciones y conservar la ruta original
  if (isPlatformServer(platformId)) {
    return true;
  }

  if (authService.isLoggedIn()) {
    return true;
  }

  // Si no está autenticado en el cliente, redirige al login
  return router.createUrlTree(['/login']);
};
