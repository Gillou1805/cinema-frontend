// src/app/components/admin-user-management/admin-user-management.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule }   from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule }           from '@angular/material/sort';

import { MatTableDataSource } from '@angular/material/table';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Utilisateur }        from '../../models/utilisateur';

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
  ],
  template: `
    <div class="admin-container">
      <h2>Gestion des Utilisateurs</h2>

      <mat-form-field appearance="outline" class="full-width mb-24">
        <mat-label>Rechercher un utilisateur</mat-label>
        <input
          matInput
          placeholder="Tapez un nom, prénom ou email"
          [(ngModel)]="filterValue"
          (ngModelChange)="applyFilter()"
        />
        <button
          matSuffix
          mat-icon-button
          aria-label="Effacer"
          *ngIf="filterValue"
          (click)="clearFilter()"
        >
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8">

  <-- Colonne ID -->
  <ng-container matColumnDef="id">
    <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
    <!-- On utilise bien utilisateur.idUser (et non utilisateur.id) -->
    <td mat-cell *matCellDef="let utilisateur"> {{ utilisateur.idUser }} </td>
  </ng-container>

  <!-- Colonne Nom & Prénom -->
  <ng-container matColumnDef="nomPrenom">
    <th mat-header-cell *matHeaderCellDef mat-sort-header> Nom & Prénom </th>
    <td mat-cell *matCellDef="let utilisateur">
      {{ utilisateur.nom }} {{ utilisateur.prenom }}
    </td>
  </ng-container>

  <!-- Colonne Email -->
  <ng-container matColumnDef="mail">
    <th mat-header-cell *matHeaderCellDef mat-sort-header> Email </th>
    <td mat-cell *matCellDef="let utilisateur"> {{ utilisateur.mail }} </td>
  </ng-container>

  <!-- Colonne Rôle -->
  <ng-container matColumnDef="role">
    <th mat-header-cell *matHeaderCellDef> Rôle </th>
    <td mat-cell *matCellDef="let utilisateur">
      <mat-form-field appearance="fill" class="role-select-field">
        <mat-select
          [(value)]="utilisateur.role"
          (selectionChange)="onRoleChange(utilisateur.idUser, $event.value)"
        >
          <mat-option value="USER">USER</mat-option>
          <mat-option value="ADMIN">ADMIN</mat-option>
        </mat-select>
      </mat-form-field>
    </td>
  </ng-container>

  <!-- Colonne Actions (icône “poubelle” pour supprimer) -->
  <ng-container matColumnDef="actions">
    <th mat-header-cell *matHeaderCellDef> Actions </th>
    <td mat-cell *matCellDef="let utilisateur">
      <button
        mat-icon-button
        color="warn"
        aria-label="Supprimer cet utilisateur"
        (click)="deleteUtilisateur(utilisateur.idUser)"
      >
        <mat-icon>delete</mat-icon>
      </button>
    </td>
  </ng-container>

  <!-- Définition des lignes en fonction des colonnes précédentes -->
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>


      <mat-paginator
        [pageSizeOptions]="[5, 10, 25]"
        showFirstLastButtons
      ></mat-paginator>

      <div class="add-user-container">
        <h3>Ajouter un utilisateur</h3>
        <form #addForm="ngForm" (ngSubmit)="addUtilisateur()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="input-small">
              <mat-label>Nom</mat-label>
              <input
                matInput
                name="nom"
                [(ngModel)]="newUtilisateur.nom"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="input-small">
              <mat-label>Prénom</mat-label>
              <input
                matInput
                name="prenom"
                [(ngModel)]="newUtilisateur.prenom"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="input-small">
              <mat-label>Email</mat-label>
              <input
                matInput
                name="mail"
                [(ngModel)]="newUtilisateur.mail"
                required
                email
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="input-small">
              <mat-label>Mot de passe</mat-label>
              <input
                matInput
                type="password"
                name="mdp"
                [(ngModel)]="newUtilisateur.mdp"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="fill" class="input-small">
              <mat-label>Rôle</mat-label>
              <mat-select name="role" [(ngModel)]="newUtilisateur.role" required>
                <mat-option value="USER">USER</mat-option>
                <mat-option value="ADMIN">ADMIN</mat-option>
              </mat-select>
            </mat-form-field>

            <button
              mat-flat-button
              color="primary"
              [disabled]="addForm.invalid"
              class="btn-add"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 24px;
    }
    .full-width {
      width: 100%;
    }
    .mb-24 {
      margin-bottom: 24px;
    }
    table {
      width: 100%;
      margin-bottom: 16px;
    }
    .role-select-field {
      width: 120px;
    }
    .add-user-container {
      margin-top: 32px;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
    }
    .add-user-container h3 {
      margin-bottom: 16px;
    }
    .form-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }
    .input-small {
      flex: 1 1 150px;
    }
    .btn-add {
      margin-left: auto;
      height: 56px; /* pour être aligné avec les mat-form-fields */
    }
  `]
})
export class AdminUserManagementComponent implements OnInit {
  /** Colonnes à afficher dans le tableau */
  displayedColumns: string[] = ['id', 'nomPrenom', 'mail', 'role', 'actions'];

  /** DataSource pour le MatTable */
  dataSource = new MatTableDataSource<Utilisateur>([]);

  /** Chaîne de recherche */
  filterValue: string = '';

  @ViewChild(MatPaginator, { static: true }) // angulat matérial
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit() {
    // Initialisation du paginator et du tri
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Charger tous les utilisateurs au démarrage
    this.loadUtilisateurs();
  }

  /** Charge la liste des utilisateurs depuis le backend */
  loadUtilisateurs() {
  this.utilisateurService.getAll().subscribe({
    next: (utilisateurs: Utilisateur[]) => {
      this.dataSource.data = utilisateurs;  // Vérifiez que l'ID est bien inclus dans utilisateurs
    },
    error: (err) => {
      console.error('Erreur lors du chargement des utilisateurs', err);
    }
  });
}

  /** Applique le filtre sur le tableau (recherche) */
  applyFilter() {
    const filterString = this.filterValue.trim().toLowerCase();
    this.dataSource.filter = filterString;
  }

  /** Efface la barre de recherche */
  clearFilter() {
    this.filterValue = '';
    this.applyFilter();
  }

  /** Appelé lorsque l’admin change le rôle d’un utilisateur dans la table */
  onRoleChange(utilisateurId: number, newRole: string) {
  this.utilisateurService.updateRole(utilisateurId, newRole).subscribe({ // méthode permettant de changer le rôle via l'interface admin
    next: (updatedUtilisateur) => {
      const idx = this.dataSource.data.findIndex(u => u.idUser === updatedUtilisateur.idUser);
      if (idx !== -1) {
        this.dataSource.data[idx].role = updatedUtilisateur.role;
        this.dataSource._updateChangeSubscription();
      }
    },
 
  });
}


    // src/app/components/admin-user-management/admin-user-management.component.ts

deleteUtilisateur(idUser: number) {
  if (!idUser) {
    console.error('ID utilisateur invalide');
    return;
  }
  console.log("Suppression de l'utilisateur avec l'ID :", idUser);
  // …
  this.utilisateurService.delete(idUser).subscribe({
    next: () => {
      this.dataSource.data = this.dataSource.data.filter(u => u.idUser !== idUser);
    },
    // …
  });
}






  /** Pour stocker temporairement les valeurs du formulaire "Ajouter un utilisateur" */
  newUtilisateur: {
    nom: string;
    prenom: string;
    mail: string;
    mdp: string;
    role: 'USER' | 'ADMIN';
  } = {
    nom: '',
    prenom: '',
    mail: '',
    mdp: '',
    role: 'USER'
  };

  /** Création d’un nouvel utilisateur à partir des champs du formulaire */
  addUtilisateur() {
    // Vérifier que tous les champs obligatoires sont remplis
    if (
      !this.newUtilisateur.nom.trim() ||
      !this.newUtilisateur.prenom.trim() ||
      !this.newUtilisateur.mail.trim() ||
      !this.newUtilisateur.mdp.trim() ||
      !this.newUtilisateur.role
    ) {
      return;
    }

    // Appel au service pour créer l’utilisateur
    this.utilisateurService.create(this.newUtilisateur).subscribe({
      next: (created: Utilisateur) => {
        // Ajoute le nouvel utilisateur dans le tableau
        this.dataSource.data = [...this.dataSource.data, created];
        this.dataSource._updateChangeSubscription();

        // Réinitialiser le formulaire
        this.newUtilisateur = {
          nom: '',
          prenom: '',
          mail: '',
          mdp: '',
          role: 'USER'
        };
      },
      error: (err) => {
        console.error('Erreur lors de la création d’utilisateur', err);
      }
    });
  }
}
