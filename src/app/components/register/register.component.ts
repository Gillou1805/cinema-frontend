// src/app/components/register/register.component.ts
import { Component }                 from '@angular/core';
import { Router, RouterModule }      from '@angular/router';
import { CommonModule }              from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { MatCardModule }             from '@angular/material/card';
import { MatFormFieldModule }        from '@angular/material/form-field';
import { MatInputModule }            from '@angular/material/input';
import { MatButtonModule }           from '@angular/material/button';
import { MatIconModule }             from '@angular/material/icon';

import { AuthService }               from '../../services/auth.service';
import { catchError, map, of }       from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="vh-100 d-flex align-items-center justify-content-center bg-dark text-light">
      <mat-card class="register-card shadow-lg">
        <mat-card-header class="bg-primary text-white text-center">
          <mat-card-title class="h4 mb-0">
            <mat-icon inline>person_add</mat-icon>
            Inscription
          </mat-card-title>
        </mat-card-header>

        <mat-card-content class="p-4">
          <form [formGroup]="regForm" (ngSubmit)="onSubmit()">
            <!-- Nom -->
            <mat-form-field appearance="outline" class="w-100 mb-3">
              <mat-label>Nom</mat-label>
              <input matInput formControlName="nom" autocomplete="family-name" />
              <mat-error *ngIf="regForm.get('nom')?.hasError('required')">
                Le nom est requis.
              </mat-error>
              <mat-error *ngIf="regForm.get('nom')?.hasError('pattern')">
                Le nom ne doit contenir que des lettres.
              </mat-error>
              <mat-error *ngIf="regForm.get('nom')?.hasError('maxlength')">
                Maximum 30 caractères.
              </mat-error>
            </mat-form-field>

            <!-- Prénom -->
            <mat-form-field appearance="outline" class="w-100 mb-3">
              <mat-label>Prénom</mat-label>
              <input matInput formControlName="prenom" autocomplete="given-name" />
              <mat-error *ngIf="regForm.get('prenom')?.hasError('required')">
                Le prénom est requis.
              </mat-error>
              <mat-error *ngIf="regForm.get('prenom')?.hasError('pattern')">
                Le prénom ne doit contenir que des lettres.
              </mat-error>
              <mat-error *ngIf="regForm.get('prenom')?.hasError('maxlength')">
                Maximum 30 caractères.
              </mat-error>
            </mat-form-field>

            <!-- Email avec vérif async -->
            <mat-form-field appearance="outline" class="w-100 mb-3">
              <mat-label>Email</mat-label>
              <input matInput formControlName="mail" autocomplete="email" />

              <!-- Erreur requise ou format invalide -->
              <mat-error *ngIf="regForm.get('mail')?.hasError('required')">
                L’email est requis.
              </mat-error>
              <mat-error *ngIf="regForm.get('mail')?.hasError('email')">
                Format invalide.
              </mat-error>

              <!-- Erreur "emailTaken" quand l’async validator renvoie { emailTaken: true } -->
              <mat-error *ngIf="regForm.get('mail')?.hasError('emailTaken')">
                Cet email est déjà utilisé.
              </mat-error>
            </mat-form-field>


            <!-- Mot de passe -->
            <mat-form-field appearance="outline" class="w-100 mb-3">
              <mat-label>Mot de passe</mat-label>
              <input
                matInput
                type="password"
                formControlName="mdp"
                autocomplete="new-password"
              />
              <mat-error *ngIf="regForm.get('mdp')?.hasError('required')">
                Le mot de passe est requis.
              </mat-error>
              <mat-error *ngIf="regForm.get('mdp')?.hasError('minlength')">
                Minimum 6 caractères.
              </mat-error>
            </mat-form-field>

            <!-- Confirmation mot de passe -->
            <mat-form-field appearance="outline" class="w-100 mb-4">
              <mat-label>Confirmer mot de passe</mat-label>
              <input
                matInput
                type="password"
                formControlName="confirmMdp"
                autocomplete="new-password"
              />
              <mat-error *ngIf="regForm.hasError('mismatch')">
                Les mots de passe ne correspondent pas.
              </mat-error>
            </mat-form-field>

            <button
              mat-flat-button
              color="accent"
              class="w-100 mb-2"
              [disabled]="regForm.invalid"
            >
              <mat-icon inline>check_circle</mat-icon>
              S’inscrire
            </button>
          </form>

          <div *ngIf="message" class="alert alert-info mt-3 text-center">
            {{ message }}
          </div>
        </mat-card-content>

        <mat-card-actions class="justify-content-center bg-secondary py-3">
          <a routerLink="/login" class="text-warning fw-bold">
            Déjà inscrit·e ? Se connecter
          </a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .bg-dark { background-color: #121212 !important; }
    .bg-secondary { background-color: #1f1f1f !important; }
    .register-card { max-width: 420px; border-radius: 1rem; overflow: hidden; }
    mat-card-header { padding: 1.25rem; }
    mat-card-title { font-family: 'Roboto'; font-weight: 500; font-size: 1.5rem; }
    mat-form-field { --mat-form-field-underline-active: #ff4081; }
    button[mat-flat-button] { font-weight: 600; }
    .alert { font-size: 0.9rem; }
  `]
})
export class RegisterComponent {
  regForm: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    const namePattern = '^[A-Za-zÀ-ÖØ-öø-ÿ \\-\' ]+$';

    this.regForm = this.fb.group({
      nom: [
        '',
        [
          Validators.required,
          Validators.pattern(namePattern),
          Validators.maxLength(30)
        ]
      ],
      prenom: [
        '',
        [
          Validators.required,
          Validators.pattern(namePattern),
          Validators.maxLength(30)
        ]
      ],
      mail: [
    '',
    {
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.emailTakenValidator()],
      updateOn: 'blur'         // validation async déclenchée au blur
    }
  ],
      mdp: ['', [Validators.required, Validators.minLength(6)]],
      confirmMdp: ['', Validators.required]
    }, {
      validators: [this.passwordsMatch('mdp','confirmMdp')]
    });
  }

  private emailTakenValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      return this.authService.checkEmail(control.value).pipe(
        map(exists => exists ? { emailTaken: true } : null),
        catchError(() => of(null))
      );
    };
  }

  private passwordsMatch(pwKey: string, confirmKey: string) {
    return (group: FormGroup) => {
      const pw = group.get(pwKey)?.value;
      const cm = group.get(confirmKey)?.value;
      return pw === cm ? null : { mismatch: true };
    };
  }

  onSubmit(): void {
    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      return;
    }
    const { nom, prenom, mail, mdp } = this.regForm.value;
    this.authService.register(nom, prenom, mail, mdp).subscribe({
      next: () => {
        this.message = 'Inscription réussie !';
        setTimeout(() => this.router.navigate(['/login']),2000);
      },
      error: err => {
        console.error(err);
        this.message = 'Échec de l’inscription.';
      }
    });
  }
}
