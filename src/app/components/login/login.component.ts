// src/app/components/login/login.component.ts
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

import { AuthService }          from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
    <div class="vh-100 d-flex align-items-center justify-content-center bg-dark text-light">
      <mat-card class="login-card shadow-lg">
        <mat-card-header class="bg-primary text-white text-center">
          <mat-card-title class="h4 mb-0">
            <mat-icon inline>movie</mat-icon>
            Connexion
          </mat-card-title>
        </mat-card-header>

        <mat-card-content class="p-4">
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="mb-3">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Email</mat-label>
                <input
                  matInput
                  name="email"
                  type="email"
                  [(ngModel)]="email"
                  required
                  autocomplete="username"
                />
                <mat-icon matSuffix>mail</mat-icon>
              </mat-form-field>
            </div>

            <div class="mb-4">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Mot de passe</mat-label>
                <input
                  matInput
                  name="password"
                  type="password"
                  [(ngModel)]="password"
                  required
                  autocomplete="current-password"
                />
                <mat-icon matSuffix>lock</mat-icon>
              </mat-form-field>
            </div>

            <button
              mat-flat-button
              color="accent"
              class="w-100 mb-2"
              [disabled]="loginForm.invalid"
            >
              <mat-icon inline>login</mat-icon>
              Se connecter
            </button>
          </form>

          <div *ngIf="errorMsg" class="alert alert-danger mt-3 text-center">
            {{ errorMsg }}
          </div>
        </mat-card-content>

        <mat-card-actions class="justify-content-center bg-secondary py-3">
          <a routerLink="/register" class="text-decoration-none text-warning fw-bold">
            Pas encore de compte ? Inscription
          </a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .bg-dark { background-color: #121212 !important; }
    .bg-secondary { background-color: #1f1f1f !important; }

    .login-card {
      width: 100%;
      max-width: 380px;
      border-radius: 1rem;
      overflow: hidden;
    }

    mat-card-header {
      padding: 1.25rem;
    }

    mat-card-title {
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    mat-form-field {
      --mat-form-field-underline-inactive: #444;
      --mat-form-field-underline-active: #ff4081;
    }

    button[mat-flat-button] {
      font-weight: 600;
    }

    .alert {
      font-size: 0.9rem;
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMsg: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: _res => {
        const role = this.authService.getRoleValue();
        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: err => {
        console.error('Erreur de connexion', err);
        this.errorMsg = 'Email ou mot de passe invalide.';
      }
    });
  }
}
