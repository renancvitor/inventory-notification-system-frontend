import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (_, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const redirectForFirstAccess = () => {
    if (authService.mustUpdatePassword() && state.url !== '/update-password') {
      return router.createUrlTree(['/update-password']);
    }

    return true;
  };

  if (authService.isAuthenticated()) {
    return redirectForFirstAccess();
  }

  return authService.checkSession().pipe(
    map((isAuthenticated) =>
      isAuthenticated ? redirectForFirstAccess() : router.createUrlTree(['/login'])
    )
  );
};
