// src/app/components/edit-salle/edit-salle.component.ts
import { Component, OnInit }        from '@angular/core';
import { CommonModule }             from '@angular/common';
import { FormsModule, NgForm }      from '@angular/forms';
import { ActivatedRoute, Router }   from '@angular/router';

import { MatCardModule }            from '@angular/material/card';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';

import { SalleService }             from '../../services/salle.service';
import { Salle }                    from '../../models/salle';

@Component({
  selector: 'app-edit-salle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container my-5" *ngIf="salle">
      <mat-card class="shadow-sm">
        <mat-card-header class="bg-light">
          <mat-card-title>Modifier la salle #{{ id }}</mat-card-title>
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

            <!-- Sièges standard -->
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
                  Requis.
                </mat-error>
                <mat-error *ngIf="std.hasError('max')">
                  Maximum 200.
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Sièges spéciaux -->
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
                  Requis.
                </mat-error>
                <mat-error *ngIf="spec.hasError('max')">
                  Maximum 200.
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Sièges PMR -->
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
                  Requis.
                </mat-error>
                <mat-error *ngIf="pmr.hasError('max')">
                  Maximum 200.
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Cinema ID (fixe) -->
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
              <!-- hidden -->
              <input
                type="hidden"
                name="cinemaId"
                [(ngModel)]="cinemaId"
              />
            </div>

            <!-- Enregistrer -->
            <div class="col-12 text-end">
              <button
                mat-flat-button
                color="primary"
                [disabled]="f.invalid"
              >
                <mat-icon inline>save</mat-icon>
                Enregistrer
              </button>
            </div>
          </form>

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
export class EditSalleComponent implements OnInit {
  id!: number;
  salle!: Salle;
  cinemaId = 1;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private svc: SalleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(this.id).subscribe({
      next: s => {
        this.salle = s;
        this.cinemaId = s.cinema?.idCinema ?? 1;
      },
      error: () => this.errorMsg = 'Impossible de charger cette salle'
    });
  }

  onSubmit(f: NgForm) {
    if (f.invalid) return;
    const payload = {
      ...this.salle,
      cinema: { idCinema: this.cinemaId }
    } as any;
    this.svc.update(this.id, payload).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: err => this.errorMsg = err.error || 'Erreur à la mise à jour'
    });
  }
}
