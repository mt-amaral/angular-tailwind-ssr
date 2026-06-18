import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.initAuth().pipe(
    map((isAuthenticated) =>
      isAuthenticated
        ? true
        : router.createUrlTree(['/auth/sign-in'], { queryParams: { returnUrl: state.url } }),
    ),
  );
};
