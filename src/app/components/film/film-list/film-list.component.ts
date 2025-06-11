// src/app/components/film/film-list/film-list.component.ts
import { Component, OnInit }    from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule }         from '@angular/router';
import { FormsModule }          from '@angular/forms';
import { MatToolbarModule }     from '@angular/material/toolbar';
import { MatIconModule }        from '@angular/material/icon';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatInputModule }       from '@angular/material/input';
import { MatCardModule }        from '@angular/material/card';
import { MatDividerModule }     from '@angular/material/divider';
import { MatButtonModule }      from '@angular/material/button';

import { FilmService }          from '../../../services/film.service';
import { Film }                 from '../../../models/film';

@Component({
  selector: 'app-film-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule
  ],
  template: `
    <div class="container my-4">
      <!-- Toolbar with search + add button -->
      <mat-toolbar color="primary" class="rounded mb-4">
        <span class="h5 mb-0">Gestion des Films</span>
        <span class="flex-spacer"></span>

        <mat-form-field appearance="outline" class="me-3" style="width: 250px;">
          <mat-icon matPrefix>search</mat-icon>
          <input
            matInput
            placeholder="Rechercher un film"
            [(ngModel)]="filter"
            (ngModelChange)="applyFilter()"
          />
        </mat-form-field>

        <button mat-flat-button color="accent"
                routerLink="/admin/films/create"
                aria-label="Ajouter un film">
          <mat-icon inline class="me-1">add_circle</mat-icon>
          Ajouter un film
        </button>
      </mat-toolbar>

      <!-- Grille des films -->
      <div class="row gx-4 gy-4">
        <div *ngFor="let f of displayedFilms" class="col-12 col-md-6 col-lg-4 d-flex">
          <mat-card class="w-100 film-card d-flex flex-column">

            <!-- Wrapper fixe 16:9 -->
            <div class="image-wrapper">
              <img *ngIf="f.image"
                   [src]="f.image"
                   alt="{{ f.titre }}"
                   class="film-cover">
            </div>

            <mat-card-header>
              <mat-card-title class="d-flex align-items-center">
                <mat-icon inline class="me-2">movie</mat-icon>
                {{ f.titre }}
              </mat-card-title>
              <mat-card-subtitle>Durée : {{ f.duree }} min</mat-card-subtitle>
            </mat-card-header>

            <mat-divider></mat-divider>

            <mat-card-content class="flex-grow-1">
              <p class="description">
                {{ f.description || 'Pas de description.' }}
              </p>
            </mat-card-content>

            <mat-divider></mat-divider>

            <mat-card-actions class="d-flex justify-content-between">
              <button mat-stroked-button color="accent"
                      [routerLink]="['/admin/films', f.idFilm, 'edit']">
                <mat-icon inline class="me-1">edit</mat-icon>
                Éditer
              </button>
              <button mat-stroked-button color="warn"
                      (click)="onDelete(f.idFilm!)">
                <mat-icon inline class="me-1">delete_outline</mat-icon>
                Supprimer
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .flex-spacer { flex: 1 1 auto; }
    mat-toolbar.rounded { border-radius: 4px; }
    .film-card {
      transition: transform .2s, box-shadow .2s;
    }
    .film-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }
    .image-wrapper {
      position: relative;
      width: 100%;
      padding-top: 56.25%;
      background: #f0f0f0;
      overflow: hidden;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    .film-cover {
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: contain;
      object-position: center;
    }
    .description {
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    mat-card-actions button { width: 48%; }
  `]
})
export class FilmListComponent implements OnInit {
  films: Film[] = [];
  displayedFilms: Film[] = [];
  filter: string = '';

  constructor(private svc: FilmService) {}

  ngOnInit() {
    this.loadAllFilms();
  }

  loadAllFilms() {
    this.svc.getAll().subscribe({
      next: (data: Film[]) => {
        this.films = data;
        this.displayedFilms = data;
      },
      error: err => console.error('Erreur chargement films', err)
    });
  }

  applyFilter() {
    const f = this.filter.trim().toLowerCase();
    this.displayedFilms = this.films.filter(film =>
      film.titre.toLowerCase().includes(f) ||
      (film.description || '').toLowerCase().includes(f)
    );
  }

  onDelete(id: number) {
    if (!confirm('Voulez-vous vraiment supprimer ce film ?')) {
      return;
    }
    this.svc.delete(id).subscribe({
      next: () => this.loadAllFilms(),
      error: err => console.error('Erreur suppression film', err)
    });
  }
}
