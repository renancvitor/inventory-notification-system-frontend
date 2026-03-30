import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { UserTypeName } from './auth.model';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedUserTypes = route.data?.['allowedUserTypes'] as UserTypeName[] | undefined;

  const redirectForFirstAccess = () => {
    if (authService.mustUpdatePassword() && state.url !== '/update-password') {
      return router.createUrlTree(['/update-password']);
    }

    if (allowedUserTypes?.length && !authService.hasAnyUserType(allowedUserTypes)) {
      return router.createUrlTree(['/']);
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
