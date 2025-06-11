// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

//assure que toutes les requêtes HTTP émises par HttpClient sont, si possible, enrichies du jeton JWT stocké côté client.
@Injectable() //marque une classe pour qu’elle soit gérée par le conteneur d’injection de dépendances d’Angular, permettant d’y injecter d’autres services et de l’injecter elle-même là où on en a besoin.
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  //cet interceptor garantit que toutes les requêtes HTTP sortantes incluent, quand il y en a un, le jeton d’authentification dans l’en-tête Authorization, sans avoir à l’ajouter manuellement à chaque appel.
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned); // cree un clone si le token existe
    } else {
      return next.handle(req); //sinon ne touche rien et envoyer sans entete autorization et le backend traitera la demande et rejetera la demande si l url demande une authentification
    }
  }
}
