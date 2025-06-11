// src/app/components/film/create-film/create-film.component.ts
import { Component }            from '@angular/core';
import { Router }               from '@angular/router';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { RouterModule }         from '@angular/router';

import { MatCardModule }        from '@angular/material/card';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatInputModule }       from '@angular/material/input';
import { MatButtonModule }      from '@angular/material/button';
import { MatIconModule }        from '@angular/material/icon';

import { FilmService }          from '../../../services/film.service';
import { Film }                 from '../../../models/film';

@Component({
  selector: 'app-create-film',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container my-5">
      <mat-card class="shadow-sm">
        <!-- En-tête -->
        <mat-card-header class="bg-light">
          <mat-card-title class="h5 mb-0">
            <mat-icon inline class="me-2">movie</mat-icon>
            Ajouter un nouveau film
          </mat-card-title>
        </mat-card-header>

        <!-- Contenu du formulaire -->
        <mat-card-content>
          <form #filmForm="ngForm" (ngSubmit)="onSubmit()" class="row g-3">
            <!-- Titre -->
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Titre</mat-label>
              <input
                matInput
                name="titre"
                required
                minlength="2" maxlength="100"
                [(ngModel)]="film.titre"
                #titre="ngModel"
              />
              <mat-icon matSuffix>title</mat-icon>
              <mat-error *ngIf="titre.touched && titre.errors">
                <ng-container *ngIf="titre.errors['required']">
                  Le titre est requis.
                </ng-container>
                <ng-container *ngIf="titre.errors['minlength']">
                  Au moins 2 caractères (actuellement {{ titre.errors['minlength'].actualLength }}).
                </ng-container>
                <ng-container *ngIf="titre.errors['maxlength']">
                  Maximum 100 caractères (actuellement {{ titre.errors['maxlength'].actualLength }}).
                </ng-container>
              </mat-error>
            </mat-form-field>

            <!-- Durée -->
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Durée (min)</mat-label>
              <input
                matInput
                type="number"
                name="duree"
                required
                min="20" max="400"
                [(ngModel)]="film.duree"
                #duree="ngModel"
              />
              <mat-icon matSuffix>schedule</mat-icon>
              <mat-error *ngIf="duree.touched && duree.errors">
                <ng-container *ngIf="duree.errors['required']">
                  La durée est requise.
                </ng-container>
                <ng-container *ngIf="duree.errors['min']">
                  Minimum 20 minutes.
                </ng-container>
                <ng-container *ngIf="duree.errors['max']">
                  Maximum 400 minutes.
                </ng-container>
              </mat-error>
            </mat-form-field>

            <!-- URL Affiche -->
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>URL Affiche</mat-label>
              <input
                matInput
                type="url"
                name="image"
                placeholder="http://..."
                pattern="^http://.+"
                [(ngModel)]="film.image"
                #image="ngModel"
              />
              <mat-icon matSuffix>image</mat-icon>
              <mat-error *ngIf="image.touched && image.errors?.['pattern']">
                L’URL doit commencer par <code>http://</code>.
              </mat-error>
            </mat-form-field>

            <!-- URL YouTube (trailer) -->
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>URL YouTube (trailer)</mat-label>
              <input
                matInput
                type="url"
                name="trailerUrl"
                placeholder="https://..."
                pattern="^https://.+"
                [(ngModel)]="film.trailerUrl"
                #trailer="ngModel"
              />
              <mat-icon matSuffix>ondemand_video</mat-icon>
              <mat-error *ngIf="trailer.touched && trailer.errors?.['pattern']">
                L’URL doit commencer par <code>https://</code>.
              </mat-error>
            </mat-form-field>

            <!-- Description -->
            <div class="col-12">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Description</mat-label>
                <textarea
                  matInput
                  name="description"
                  rows="4"
                  [(ngModel)]="film.description"
                ></textarea>
                <mat-icon matSuffix>description</mat-icon>
              </mat-form-field>
            </div>


            <!-- Prix des sièges -->
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Prix standard (€)</mat-label>
              <input
                matInput
                type="number"
                name="prixSiegeStd"
                required
                min="3" max="30"
                [(ngModel)]="film.prixSiegeStd"
                #prixStd="ngModel"
              />
              <mat-icon matSuffix>euro</mat-icon>
              <mat-error *ngIf="prixStd.touched && prixStd.errors">
                <ng-container *ngIf="prixStd.errors['required']">
                  Prix standard requis.
                </ng-container>
                <ng-container *ngIf="prixStd.errors['min']">
                  Minimum 3 €.
                </ng-container>
                <ng-container *ngIf="prixStd.errors['max']">
                  Maximum 30 €.
                </ng-container>
              </mat-error>
            </mat-form-field>

           <div class="col-md-4">
  <mat-form-field appearance="outline" class="w-100">
    <mat-label>Prix spécial (€)</mat-label>
    <input
      matInput
      type="number"
      name="prixSiegeSpecial"
      required
      min="3" max="30"
      [(ngModel)]="film.prixSiegeSpecial"
      #prixSpec="ngModel"
    />
    <mat-icon matSuffix>euro</mat-icon>
    <mat-error *ngIf="prixSpec.touched && prixSpec.errors">
      <ng-container *ngIf="prixSpec.errors['required']">
        Prix spécial requis.
      </ng-container>
      <ng-container *ngIf="prixSpec.errors['min']">
        Minimum 3 €.
      </ng-container>
      <ng-container *ngIf="prixSpec.errors['max']">
        Maximum 30 €.
      </ng-container>
    </mat-error>
  </mat-form-field>
</div>

<div class="col-md-4">
  <mat-form-field appearance="outline" class="w-100">
    <mat-label>Prix PMR (€)</mat-label>
    <input
      matInput
      type="number"
      name="prixSiegePmr"
      required
      min="3" max="30"
      [(ngModel)]="film.prixSiegePmr"
      #prixPmr="ngModel"
    />
    <mat-icon matSuffix>euro</mat-icon>
    <mat-error *ngIf="prixPmr.touched && prixPmr.errors">
      <ng-container *ngIf="prixPmr.errors['required']">
        Prix PMR requis.
      </ng-container>
      <ng-container *ngIf="prixPmr.errors['min']">
        Minimum 3 €.
      </ng-container>
      <ng-container *ngIf="prixPmr.errors['max']">
        Maximum 30 €.
      </ng-container>
    </mat-error>
  </mat-form-field>
</div>

            <!-- Actions -->
            <div class="col-12 d-flex justify-content-between align-items-center">
              <button
                mat-stroked-button
                color="warn"
                routerLink="/admin/films"
                type="button"
              >
                <mat-icon inline class="me-1">arrow_back</mat-icon>
                Annuler
              </button>
              <button
                mat-flat-button
                color="primary"
                type="submit"
                [disabled]="filmForm.invalid"
              >
                <mat-icon inline class="me-1">add_circle</mat-icon>
                Créer le film
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 720px;
    }
    mat-card-header {
      background-color: #f5f5f5;
    }
    mat-card-title {
      font-weight: 600;
      display: flex;
      align-items: center;
    }
    mat-form-field {
      --mat-form-field-underline-inactive: #ccc;
      --mat-form-field-underline-active:   #3f51b5;
    }
    button[mat-flat-button] {
      min-width: 140px;
    }
  `]
})
export class CreateFilmComponent {
  film: Film = {
    idFilm: undefined,
    titre: '',
    duree: 0,
    description: '',
    prixSiegeStd: 0,
    prixSiegeSpecial: 0,
    prixSiegePmr: 0,
    image: '',
    
    trailerUrl: '' 
  };

  constructor(
    private svc: FilmService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.film.titre || !this.film.duree) { return; } //Vérifie que le titre et la durée du film sont renseignés.   
    this.svc.create(this.film).subscribe({ //Appelle le service pour créer le film.
      next: () => this.router.navigate(['/admin/films']), //Si la création réussit, redirige vers la page d’administration des films.
      error: err => console.error('Erreur création film', err)
    });
  }
}
