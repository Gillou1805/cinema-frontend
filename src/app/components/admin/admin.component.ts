// src/app/components/admin/admin.component.ts
import { Component }       from '@angular/core';
import { CommonModule }    from '@angular/common';
import { RouterModule }    from '@angular/router';
import { MatIconModule }   from '@angular/material/icon';

@Component({
  selector: 'app-admin', //nom de la balise HTML qu’on utilisera dans un template parent
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // pour pouvoir déclarer la liste des routes
    MatIconModule
  ],
  template: `
    <nav class="navbar mb-4 rounded shadow-sm">
      <div class="container">
        <span class="navbar-brand fw-bold h5 mb-0">Administration</span>
        <div class="d-flex">
          <a class="btn btn-outline-light btn-sm me-2"
             routerLink="salles/create">
            <mat-icon inline class="me-1">add_box</mat-icon>
            Nouvelle salle
          </a>
          <a class="btn btn-outline-light btn-sm me-2"
             routerLink="salles">
            <mat-icon inline class="me-1">meeting_room</mat-icon>
            Liste des salles
          </a>
          <a class="btn btn-outline-light btn-sm me-2"
             routerLink="films">
            <mat-icon inline class="me-1">movie</mat-icon>
            Gestion des films
          </a>
          <a class="btn btn-outline-light btn-sm"
             routerLink="users">
            <mat-icon inline class="me-1">people</mat-icon> 
            Utilisateurs
          </a>
        </div>
      </div>
    </nav>

    <div class="container admin-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    /* Barre : bleu un peu plus foncé */
    .navbar {
      background-color: #1976d2 !important;
    }

    /* Boutons clairs sur fond bleu */
    .btn-outline-light {
      color: #fff;
      border-color: rgba(255,255,255,0.7);
    }
    .btn-outline-light:hover {
      background-color: rgba(255,255,255,0.2);
      color: #fff;
    }

    .navbar-brand {
      color: #fff !important;
    }

    .admin-content {
      background-color: #ffffff;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      min-height: 60vh;
    }
  `]
})
export class AdminComponent {}
