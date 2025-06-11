// src/app/components/create-salle/create-salle.component.ts
import { Component }      from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, NgForm }    from '@angular/forms';
import { Router }         from '@angular/router';

import { MatCardModule }        from '@angular/material/card';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatInputModule }       from '@angular/material/input';
import { MatButtonModule }      from '@angular/material/button';
import { MatIconModule }        from '@angular/material/icon';

import { SalleService }    from '../../services/salle.service';
import { Salle }           from '../../models/salle';

@Component({
  selector: 'app-create-salle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    // Angular Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container my-5">
      <mat-card class="shadow-sm">
        <mat-card-header class="bg-light">
          <mat-card-title>Créer une nouvelle salle</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #f="ngForm" (ngSubmit)="onSubmit(f)" class="row g-3">
            <!-- Description -->
            <div class="col-12">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Description</mat-label>
                <input
                  matInput
                  name="description"
                  [(ngModel)]="salle.description"
                  #desc="ngModel"
                  required
                />
                <mat-icon matSuffix>article</mat-icon>
                <mat-error *ngIf="desc.invalid && desc.touched">
                  La description est requise.
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Capacité -->
            <div class="col-md-6">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Capacité</mat-label>
                <input
                  matInput
                  type="number"
                  name="capacite"
                  [(ngModel)]="salle.capacite"
                  #cap="ngModel"
                  required
                  min="1"
                  max="200"
                />
                <mat-icon matSuffix>people</mat-icon>
                <mat-error *ngIf="cap.hasError('required') && cap.touched">
                  La capacité est requise.
                </mat-error>
                <mat-error *ngIf="cap.hasError('max')">
                  Maximum 200 sièges.
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Nb sièges standard -->
            <div class="col-md-6">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Sièges standard</mat-label>
                <input
                  matInput
                  type="number"
                  name="nbrSiegeStd"
                  [(ngModel)]="salle.nbrSiegeStd"
                  #std="ngModel"
                  required
                  min="0"
                  max="200"
                />
                <mat-icon matSuffix>chair</mat-icon>
                <mat-error *ngIf="std.hasError('required') && std.touched">
                  Ce champ est requis.
                </mat-error>
                <mat-error *ngIf="std.hasError('max')">
                  Maximum 200.
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Nb sièges spéciaux -->
            <div class="col-md-6">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Sièges spéciaux</mat-label>
                <input
                  matInput
                  type="number"
                  name="nbrSiegeSpecial"
                  [(ngModel)]="salle.nbrSiegeSpecial"
                  #spec="ngModel"
                  required
                  min="0"
                  max="200"
                />
                <mat-icon matSuffix>airline_seat_recline_normal</mat-icon>
                <mat-error *ngIf="spec.hasError('required') && spec.touched">
                  Ce champ est requis.
                </mat-error>
                <mat-error *ngIf="spec.hasError('max')">
                  Maximum 200.
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Nb sièges PMR -->
            <div class="col-md-6">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Sièges PMR</mat-label>
                <input
                  matInput
                  type="number"
                  name="nbrSiegePmr"
                  [(ngModel)]="salle.nbrSiegePmr"
                  #pmr="ngModel"
                  required
                  min="0"
                  max="200"
                />
                <mat-icon matSuffix>accessible</mat-icon>
                <mat-error *ngIf="pmr.hasError('required') && pmr.touched">
                  Ce champ est requis.
                </mat-error>
                <mat-error *ngIf="pmr.hasError('max')">
                  Maximum 200.
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Cinema ID fixe -->
            <div class="col-md-6">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Cinéma (ID)</mat-label>
                <input
                  matInput
                  type="number"
                  [value]="cinemaId"
                  readonly
                />
                <mat-icon matSuffix>location_city</mat-icon>
              </mat-form-field>
              <!-- champ caché pour la soumission -->
              <input
                type="hidden"
                name="cinemaId"
                [(ngModel)]="cinemaId"
              />
            </div>

            <!-- Bouton de validation -->
            <div class="col-12 text-end">
              <button
                mat-flat-button
                color="primary"
                [disabled]="f.invalid"
              >
                <mat-icon inline>add_circle</mat-icon>
                Créer
              </button>
            </div>
          </form>

          <!-- Message d'erreur -->
          <div *ngIf="errorMsg" class="alert alert-danger mt-3">
            {{ errorMsg }}
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 720px; }
    mat-card-header { background-color: #f5f5f5; }
    mat-card-title { font-weight: 600; }
    .alert { margin-top: 1rem; }
  `]
})
export class CreateSalleComponent {
  salle: Partial<Salle> = {
    description: '',
    capacite: 0,
    nbrSiegeStd: 0,
    nbrSiegeSpecial: 0,
    nbrSiegePmr: 0,
    photo: '',
    calendriers: [],
    cinema: { idCinema: 1 } as any
  };
  cinemaId = 1;    // fixe à 1
  errorMsg = '';

  constructor(
    private svc: SalleService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const payload = {
      ...this.salle,
      cinema: { idCinema: this.cinemaId }
    } as Omit<Salle, 'idSalle'>;

    this.svc.create(payload).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: err => this.errorMsg = err.error || 'Erreur à la création'
    });
  }
}
