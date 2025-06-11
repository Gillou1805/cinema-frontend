// src/app/guards/admin.guard.ts

import { Injectable }                    from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, tap }         from 'rxjs';
import { AuthService }                   from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // getRole() renvoie Observable<string | null>
    return this.auth.getRole().pipe(
      map(role => role === 'ADMIN'),         // true si c’est exactement 'ADMIN'
      tap(isAdmin => {
        if (!isAdmin) {
          // redirige si ce n’est pas ADMIN
          this.router.navigate(['/salles']);
        }
      })
    );
  }
}
