// src/app/components/salle-list/salle-list.component.ts
import { Component, OnInit }         from '@angular/core';
import { CommonModule }              from '@angular/common';
import { RouterModule }              from '@angular/router';
import { MatToolbarModule }          from '@angular/material/toolbar';
import { MatIconModule }             from '@angular/material/icon';
import { MatCardModule }             from '@angular/material/card';
import { MatDividerModule }          from '@angular/material/divider';
import { MatButtonModule }           from '@angular/material/button';

import { SalleService }              from '../../services/salle.service';
import { AuthService }               from '../../services/auth.service';
import { Salle }                     from '../../models/salle';

@Component({
  selector: 'app-salle-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule
  ],
  template: `
    <div class="container my-4">
      <!-- Toolbar -->
      <mat-toolbar color="primary" class="mb-4 rounded">
        <span class="h5 mb-0">Gestion des Salles</span>
        <span class="flex-spacer"></span>
        <button mat-icon-button
                routerLink="/admin/salles/create"
                aria-label="Ajouter une salle">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-icon-button
                routerLink="/admin/films"
                aria-label="Gestion des films">
          <mat-icon>movie</mat-icon>
        </button>
      </mat-toolbar>

      <!-- Liste des salles -->
      <div class="row gx-4 gy-4">
        <div *ngFor="let s of salles" class="col-12 col-md-6 col-lg-4 d-flex">
          <mat-card class="w-100 salle-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon inline class="me-1">meeting_room</mat-icon>
                Salle #{{ s.idSalle }}
              </mat-card-title>
              <mat-card-subtitle>{{ s.description }}</mat-card-subtitle>
            </mat-card-header>

            <mat-divider></mat-divider>

            <mat-card-content class="py-2">
              <p><strong>Capacité :</strong> {{ s.capacite }}</p>
              <div class="d-flex justify-content-between">
                <small><strong>Std:</strong> {{ s.nbrSiegeStd }}</small>
                <small><strong>Spé:</strong> {{ s.nbrSiegeSpecial }}</small>
                <small><strong>PMR:</strong> {{ s.nbrSiegePmr }}</small>
              </div>
            </mat-card-content>

            <mat-divider></mat-divider>

            <mat-card-actions class="py-2 d-flex justify-content-between">
              <button mat-stroked-button color="accent"
                      [routerLink]="['/admin/salles', s.idSalle, 'calendrier']">
                <mat-icon inline class="me-1">calendar_today</mat-icon>
                Calendrier
              </button>
              <button mat-stroked-button color="primary"
                      [routerLink]="['/admin/salles', s.idSalle, 'edit']">
                <mat-icon inline class="me-1">edit</mat-icon>
                Éditer
              </button>
              <button mat-stroked-button color="warn"
                      (click)="onDelete(s.idSalle!)">
                <mat-icon inline class="me-1">delete</mat-icon>
                Supprimer
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .flex-spacer {
      flex: 1 1 auto;
    }
    mat-toolbar.rounded {
      border-radius: 4px;
    }
    .salle-card {
      transition: transform .2s, box-shadow .2s;
    }
    .salle-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }
    mat-card-content p {
      margin: 0 0 .5rem 0;
    }
    mat-card-actions button {
      flex: 1;
      margin: 0 4px;
    }
  `]
})
export class SalleListComponent implements OnInit {
  salles: Salle[] = [];

  constructor(
    private svc: SalleService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadSalles();
  }

  loadSalles() {
    this.svc.getAll().subscribe(data => this.salles = data);
  }

  onDelete(id: number) {
    if (!confirm('Voulez-vous vraiment supprimer cette salle ?')) {
      return;
    }
    this.svc.delete(id).subscribe({
      next: () => this.loadSalles(),
      error: err => console.error('Erreur suppression salle', err)
    });
  }
}
