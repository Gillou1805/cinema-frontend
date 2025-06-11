import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }                  from '@angular/common';
import { RouterModule }                  from '@angular/router';
import { MatToolbarModule }              from '@angular/material/toolbar';
import { MatGridListModule }             from '@angular/material/grid-list';
import { MatCardModule }                 from '@angular/material/card';
import { MatButtonModule }               from '@angular/material/button';
import { MatIconModule }                 from '@angular/material/icon';
import { MatInputModule }                from '@angular/material/input';
import { FormsModule }                   from '@angular/forms';

import { FilmService }                   from '../../../services/film.service';
import { Film }                          from '../../../models/film';

@Component({
  selector: 'app-client-main-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  template: `
    <div class="main-page-container">

      <!-- Hero Banner ajusté au format original 2/3 -->
      <div class="hero">
        <img [src]="currentBannerUrl" alt="Bannière" />
      </div>

      <!-- Toolbar thématique avec couleur jaune -->
      <mat-toolbar class="app-toolbar">
        <mat-icon>movie_filter</mat-icon>
        <span class="toolbar-title">CinemaClient</span>
        <span class="spacer"></span>
        <mat-form-field class="search" appearance="outline">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput
                 placeholder="Rechercher un film"
                 [(ngModel)]="filter"
                 (ngModelChange)="applyFilter()">
        </mat-form-field>
      </mat-toolbar>

      <!-- Grille de films -->
      <div class="grid">
        <mat-card *ngFor="let film of displayedFilms"
                  class="movie-card"
                  [routerLink]="['/films', film.idFilm]">

          <div class="poster-wrapper">
            <img [src]="film.image" alt="{{film.titre}}">
          </div>

          <mat-card-content>
            <h3>{{ film.titre }}</h3>
            <p class="subtitle">{{ film.duree }} min</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`` +
    `/* Conteneur global */
    .main-page-container {
      background-color: #121212;
      color: #ffffff;
      min-height: 100vh;
    }

    /* Hero Banner (original 2/3 format) */
    .hero {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 25vw;
      max-height: 300px;
      min-height: 150px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    .hero img {
      width: auto;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    /* Dégradés latéraux noir -> blanc de bas en haut */
    .hero::before, .hero::after {
      content: '';
      position: absolute;
      top: 0;
      width: 60px;
      height: 100%;
      pointer-events: none;
      background: linear-gradient(to top, black, white);
    }
    .hero::before { left: 0; }
    .hero::after { right: 0; transform: scaleX(-1); }

    /* Toolbar jaune */
    .app-toolbar {
      background-color: #FFC107; /* Jaune cinéma */
      box-shadow: 0 2px 4px rgba(0,0,0,0.5);
      position: sticky;
      top: 0;
      z-index: 10;
      overflow: visible; /* Permet à l'input de dépasser */
    }
    .toolbar-title {
      margin-left: 8px;
      font-size: 1.5rem;
      font-weight: 500;
      color: #212121;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .search {
      width: 320px;
      margin-right: 16px;
      background: rgba(255,255,255,0.9);
      border-radius: 4px;
      position: relative;
      top: 8px; /* Décalage pour dépasser de la toolbar */
    }
    .search .mat-form-field-outline {
      border-color: rgba(0,0,0,0.3);
    }
    .search .mat-input-element {
      color: #212121;
    }
    .search mat-icon {
      color: #212121;
    }

    /* Grille et cartes */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      padding: 16px;
    }
    .movie-card {
      background-color: #1f1f1f;
      color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .movie-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.6);
    }
    .poster-wrapper {
      position: relative;
      width: 100%;
      padding-top: 150%;
    }
    .poster-wrapper img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    mat-card-content {
      padding: 8px;
    }
    mat-card-content h3 {
      font-size: 1.1rem;
      margin: 0;
    }
    .subtitle {
      font-size: 0.9rem;
      color: rgba(255,255,255,0.7);
      margin-top: 4px;
    }

    @media (max-width: 600px) {
      .search { display: none; }
    }`
]})
export class ClientMainPageComponent implements OnInit, OnDestroy {
  films: Film[] = [];
  displayedFilms: Film[] = [];
  filter = '';

  bannerUrls: string[] = [
    'http://localhost:8080/image/Jurassic-Wide.png',
    'http://localhost:8080/image/28-Wide.png',
    'http://localhost:8080/image/Materialists-Wide.png',
    'http://localhost:8080/image/Ballerina-Wide.jpg'
  ];
  currentBannerUrl: string | null = null;
  private bannerIndex = 0;
  private bannerIntervalId!: number;

  constructor(private svc: FilmService) {}

  ngOnInit() {
    this.loadAllFilms(); // charge les films , charge l'animation de la banniere et ajuste la grille pour respecter le format
    this.startBannerRotation();
    window.addEventListener('resize', () => this.updateGridCols());
    this.updateGridCols();
  }

  ngOnDestroy() {
    clearInterval(this.bannerIntervalId);
  }

  private startBannerRotation() {
    if (!this.bannerUrls.length) return;
    this.currentBannerUrl = this.bannerUrls[0];
    this.bannerIntervalId = window.setInterval(() => {
      this.bannerIndex = (this.bannerIndex + 1) % this.bannerUrls.length;
      this.currentBannerUrl = this.bannerUrls[this.bannerIndex];
    }, 10000);
  }

  loadAllFilms() {
    this.svc.getAll().subscribe({
      next: fs => {
        this.films = fs;
        this.displayedFilms = [...fs];
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

  private updateGridCols() {
    const w = window.innerWidth;
    // La propriété cols n'est plus utilisée dans le markup grâce à CSS grid
  }
}
