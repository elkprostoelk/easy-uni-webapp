import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {inject} from '@angular/core';
import {map, take} from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      }

      router.navigate(['/login']).then();
      return false;
    })
  )
};
