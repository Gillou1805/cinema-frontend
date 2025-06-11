// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  //utilisation d urltree (voir doc)

  canActivate(): Observable<boolean | UrlTree> { //true autorise la navigation
  return this.auth.getRole().pipe(
    map(role => role === 'ADMIN'),                //sinon redirige
    map(isAdmin => {                              // map appelle la fonction RxJS qui permet de transformer un observable en une nouvelle valeur, donc ici de transformer ADMIN en true
      if (isAdmin) {                              // dans ce cas ci string vers boolean
        return true;
      } else {
        // si pas ADMIN, on renvoie vers /salles
        return this.router.createUrlTree(['/salles']);
      }
    })
  );
}

}
