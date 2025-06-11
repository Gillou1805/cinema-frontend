// src/app/components/navbar/navbar.component.ts
import { Component }         from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatButtonModule }   from '@angular/material/button';
import { MatIconModule }     from '@angular/material/icon';
import { AsyncPipe }         from '@angular/common';

import { AuthService }       from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe
  ],
  template: `
    <mat-toolbar class="app-toolbar">
      <!-- Brand / Logo -->
      <span class="logo" routerLink="/">CinemaClient</span>

      <!-- Nouveaux liens -->
      <button mat-button routerLink="/home">
        <mat-icon inline>home</mat-icon>
        Home
      </button>
      <button mat-button routerLink="/info">
        <mat-icon inline>info</mat-icon>
        Infos
      </button>

     
      <button
        mat-button
        *ngIf="(auth.getRole() | async) === 'ADMIN'"
        routerLink="/admin/films">
        Gestion des films
      </button>

      <span class="spacer"></span>

      <!-- Bienvenue + prénom -->
      <span
        *ngIf="auth.isLoggedIn() | async"
        class="welcome">
        Bienvenue, {{ auth.getUsername() | async }} !
      </span>

      <!-- Connexion / Déconnexion -->
      <button
        mat-icon-button
        *ngIf="!(auth.isLoggedIn() | async)"
        routerLink="/login">
        <mat-icon>login</mat-icon>
      </button>
      <button
        mat-icon-button
        *ngIf="auth.isLoggedIn() | async"
        (click)="auth.logout()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .app-toolbar {
      background-color: #2c2c2c;
      color: white;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .logo {
      font-size: 1.25rem;
      font-weight: bold;
      color: #FFC107;
      cursor: pointer;
      margin-right: 1rem;
    }
    button[mat-button], button[mat-icon-button] {
      color: white;
    }
    .spacer { flex: 1 1 auto; }
    .welcome {
      margin-right: 1rem;
      font-style: italic;
    }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
