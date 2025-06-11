import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendrierService } from '../../services/calendrier.service';
import { CreneauService } from '../../services/creneau.service';
import { FilmService } from '../../services/film.service';
import { Calendrier } from '../../models/calendrier';
import { Creneau } from '../../models/creneau';
import { Film } from '../../models/film';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importations Angular Material pour le datepicker
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core'; // Nécessaire pour les formats de date natifs

@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,   // Importation du MatDatepicker
    MatFormFieldModule,    // Importation du MatFormField
    MatInputModule,        // Importation du MatInput
    MatNativeDateModule    // Pour la gestion de la date native
  ],
  template: `
    <div class="container mt-4">
      <!-- 1) Entête : Date du calendrier -->
      <div *ngIf="calendrier" class="mb-3">
        <div class="card">
          <div class="card-body d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              Calendrier de la salle #{{ idSalle }}
            </h5>
            <span class="badge bg-info text-dark">
              {{ calendrier.date | date:'fullDate' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 2) Sélecteur de date pour filtrer les créneaux -->
      <div class="mb-3">
        <label for="filterDate" class="form-label">Sélectionner une date</label>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Sélectionner une date</mat-label>
          <input 
            matInput 
            [matDatepicker]="picker"
            [(ngModel)]="selectedDate"
            (change)="onDateChange()" 
            placeholder="YYYY-MM-DD"
          />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </div>

      <!-- 3) Tableau des créneaux existants -->
      <div *ngIf="calendrier; else loading">
        <h6 class="mt-4">Créneaux existants :</h6>
        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 10%;">Début</th>
                <th style="width: 10%;">Fin</th>
                <th style="width: 10%;">Type</th>
                <th style="width: 40%;">Détails</th>
                <th style="width: 20%;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of creneauxFiltres">
                <td>{{ c.heureDebut | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ c.heureFin | date:'dd/MM/yyyy HH:mm' }}</td>

                <td>
                  <span 
                    class="badge"
                    [ngClass]="{
                      'bg-primary': c.type === 'film',
                      'bg-success': c.type === 'reservation',
                      'bg-warning text-dark': c.type === 'seminaire',
                      'bg-danger': c.type === 'maintenance'
                    }">
                    {{ c.type }}
                  </span>
                </td>
                <td>
                  <ng-container *ngIf="c.type === 'film' && c.film">
                    🎬 « {{ filmsMap[c.film?.idFilm!]?.titre }} »
                  </ng-container>
                  <ng-container *ngIf="c.type === 'seminaire' && c.seminaire">
                    🗣 « {{ c.seminaire.titre }} » – {{ c.seminaire.formateur }}
                  </ng-container>
                  <ng-container *ngIf="c.type !== 'film' && c.type !== 'seminaire'">
                    —
                  </ng-container>
                </td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteCreneau(c.idCreneau)">
                    <i class="bi bi-trash"></i> Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4) Formulaire d’ajout d’un nouveau créneau -->
      <h6 class="mt-5">Ajouter un créneau</h6>
      <form #f="ngForm" class="row g-3" (ngSubmit)="addCreneau()">
        <div class="col-md-3">
          <label for="typeSelect" class="form-label">Type</label>
          <select 
            id="typeSelect"
            name="type"
            class="form-select"
            [(ngModel)]="newCreneau.type"
            (change)="onTypeChange()"
            required>
            <option value="reservation">Réservation</option>
            <option value="seminaire">Séminaire</option>
            <option value="maintenance">Maintenance</option>
            <option value="film">Film</option>
          </select>
        </div>

        <div class="col-md-4" *ngIf="newCreneau.type === 'film'">
          <label for="filmSelect" class="form-label">Film</label>
          <select 
            id="filmSelect"
            name="filmId"
            class="form-select"
            [(ngModel)]="newCreneau.filmId"
            (change)="onDebutChange()"
            required>
            <option [ngValue]="null">-- choisir un film --</option>
            <option *ngFor="let f of films" [ngValue]="f.idFilm">
              {{ f.titre }} ({{ f.duree }} min)
            </option>
          </select>
        </div>

        <div class="col-md-4" *ngIf="newCreneau.type === 'seminaire'">
          <label for="seminaireTitre" class="form-label">Titre du séminaire</label>
          <input 
            id="seminaireTitre"
            name="seminaireTitre"
            class="form-control"
            [(ngModel)]="newCreneau.seminaireTitre"
            placeholder="Ex : Atelier Angular"
            required />
          <small class="form-text text-muted">Renseigner le titre du séminaire</small>
          <br>
          <label for="seminaireFormateur" class="form-label">Formateur</label>
          <input 
            id="seminaireFormateur"
            name="formateur"
            class="form-control"
            [(ngModel)]="newCreneau.formateur"
            placeholder="Nom du formateur"
            required />
          <small class="form-text text-muted">Nom de la personne qui anime</small>
        </div>

        <div class="col-md-3">
          <label for="debutInput" class="form-label">Heure début</label>
          <input
            type="datetime-local"
            id="debutInput"
            name="heureDebut"
            class="form-control"
            [(ngModel)]="newCreneau.heureDebut"
            (change)="onDebutChange()"
            required />
        </div>

        <div class="col-md-3" *ngIf="newCreneau.type !== 'film' && newCreneau.type !== 'seminaire'">
          <label for="finInput" class="form-label">Heure fin</label>
          <input
            type="datetime-local"
            id="finInput"
            name="heureFin"
            class="form-control"
            [(ngModel)]="newCreneau.heureFin"
            required />
        </div>

        <div class="col-md-3" *ngIf="newCreneau.type === 'film'">
          <label for="finFilmInput" class="form-label">Heure fin (film)</label>
          <input
            type="datetime-local"
            id="finFilmInput"
            name="heureFin"
            class="form-control"
            [(ngModel)]="newCreneau.heureFin"
            readonly />
          <small class="text-muted fst-italic">
            Calculée selon la durée du film
          </small>
        </div>

        <div class="col-md-3" *ngIf="newCreneau.type === 'seminaire'">
          <label for="finSemInput" class="form-label">Durée (min)</label>
          <input
            id="dureeSem"
            class="form-control"
            [value]="seminaireDuree"
            readonly />
          <small class="text-muted fst-italic">
            Saisir ci-dessous la durée pour calculer fin
          </small>
          <br>
          <label for="finSemHeure" class="form-label">Heure fin</label>
          <input
            type="datetime-local"
            id="finSemHeure"
            name="heureFin"
            class="form-control"
            [(ngModel)]="newCreneau.heureFin"
            required />
        </div>

        <div class="col-12">
          <button 
            type="submit"
            class="btn btn-primary"
            [disabled]="f.invalid">
            <i class="bi bi-plus-circle"></i> Ajouter
          </button>
          <span class="text-danger ms-3">{{ errorMsg }}</span>
        </div>
      </form>
    </div>

    <!-- Template de chargement -->
    <ng-template #loading>
      <div class="text-center my-5">
        <div class="spinner-border text-secondary" role="status">
          <span class="visually-hidden">Chargement…</span>
        </div>
      </div>
    </ng-template>
  `
})
export class CalendrierComponent implements OnInit {
  idSalle!: number;
  calendrier?: Calendrier;
  creneaux: Creneau[] = [];
  films: Film[] = [];
  filmsMap: Record<number, Film> = {};

  newCreneau = {
    type: 'reservation',
    heureDebut: '',
    heureFin: '',
    filmId: null,
    seminaireTitre: '',
    formateur: ''
  };

  selectedDate!: string;
  errorMsg = '';

  seminaireDuree = 60;  // Durée des séminaires par défaut

  constructor(
    private route: ActivatedRoute,
    private calendrierService: CalendrierService,
    private creneauService: CreneauService,
    private filmService: FilmService
  ) {}

  ngOnInit() {
    this.idSalle = +this.route.snapshot.paramMap.get('id')!;
    this.loadCalendrier();
    this.loadFilms();

    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];  // format "YYYY-MM-DD"
  }

  private loadCalendrier() {
    this.calendrierService.getCalendrierBySalle(this.idSalle)
      .subscribe({
        next: cal => {
          this.calendrier = cal;
          this.loadCreneaux();
        },
        error: () => this.errorMsg = 'Erreur de chargement du calendrier'
      });
  }

  private loadCreneaux() {
    if (!this.calendrier) return;
    const calId = this.calendrier.id.idCalendrier;
    this.creneauService.getCreneaux(this.idSalle, calId)
      .subscribe({
        next: data => this.creneaux = data,
        error: () => this.errorMsg = 'Erreur de chargement des créneaux'
      });
  }

  private loadFilms() {
    this.filmService.getAll()
      .subscribe({
        next: f => {
          this.films = f;
          this.filmsMap = Object.fromEntries(f.map(x => [x.idFilm, x]));
        },
        error: () => console.warn('Impossible de charger les films')
      });
  }

  get creneauxFiltres(): Creneau[] {
  if (!this.selectedDate) return this.creneaux;

  const filterDate = new Date(this.selectedDate); // Date sélectionnée
  return this.creneaux.filter(c => {
    const startDate = new Date(c.heureDebut);  // Date de début du créneau
    const endDate = new Date(c.heureFin);      // Date de fin du créneau

    // Vérifiez si la date sélectionnée est dans l'intervalle de temps du créneau
    return (
      (startDate <= filterDate && filterDate <= endDate) || // Si la date sélectionnée est entre début et fin
      (startDate.getDate() !== endDate.getDate() &&       // Si le créneau traverse deux jours
        filterDate.getDate() === startDate.getDate() ||   // Afficher si la date sélectionnée est le jour de début
        filterDate.getDate() === endDate.getDate())       // Ou si la date sélectionnée est le jour de fin
    );
  });
}



  onDateChange() {}

  deleteCreneau(id: number) {
    if (!this.calendrier) return;
    const calId = this.calendrier.id.idCalendrier;
    this.creneauService.deleteCreneau(this.idSalle, calId, id)
      .subscribe({
        next: () => this.creneaux = this.creneaux.filter(c => c.idCreneau !== id),
        error: () => this.errorMsg = 'Erreur de suppression du créneau'
      });
  }

  onDebutChange() {
    if (this.newCreneau.type === 'film' && this.newCreneau.filmId != null && this.newCreneau.heureDebut) {
      const film = this.filmsMap[this.newCreneau.filmId]!;
      // Crée un objet Date à partir de la chaîne "YYYY-MM-DDTHH:mm"
      const d = new Date(this.newCreneau.heureDebut);
      d.setMinutes(d.getMinutes() + film.duree);
      // Formate en local
      this.newCreneau.heureFin = this.formatLocalDate(d);
    }

    if (this.newCreneau.type === 'seminaire' && this.newCreneau.heureDebut) {
      const d2 = new Date(this.newCreneau.heureDebut);
      d2.setMinutes(d2.getMinutes() + this.seminaireDuree);
      this.newCreneau.heureFin = this.formatLocalDate(d2);
    }
  }

addCreneau() {
  if (!this.calendrier) return;

  // Parse des dates du nouveau créneau
  const newStart = new Date(this.newCreneau.heureDebut!);
  const newEnd   = new Date(this.newCreneau.heureFin!);

  // Vérifie qu’on a bien choisi début et fin
  if (!newStart || !newEnd) {
    this.errorMsg = 'Début et fin obligatoires';
    return;
  }

  // 1) Test de chevauchement avec les créneaux existants
  const overlap = this.creneaux.some(c => {
    const existingStart = new Date(c.heureDebut);
    const existingEnd   = new Date(c.heureFin);
    // chevauchement si newStart < existingEnd ET newEnd > existingStart
    return newStart < existingEnd && newEnd > existingStart;
  });
  if (overlap) {
    this.errorMsg = 'Ce créneau chevauche un créneau existant.';
    return;
  }

  // 2) Puis validation classique
  if (!this.newCreneau.type) {
    this.errorMsg = 'Type obligatoire';
    return;
  }

  // 3) Création du payload
  const calId = this.calendrier.id.idCalendrier;
  const payload: any = {
    type: this.newCreneau.type,
    heureDebut: this.newCreneau.heureDebut,
    heureFin: this.newCreneau.heureFin
  };  
  if (this.newCreneau.type === 'film')      payload.filmId = this.newCreneau.filmId;
  if (this.newCreneau.type === 'seminaire') {
    payload.seminaireTitre = this.newCreneau.seminaireTitre;
    payload.formateur      = this.newCreneau.formateur;
  }

  // 4) Appel au service
  this.creneauService.createCreneau(this.idSalle, calId, payload).subscribe({
    next: c => {
      this.creneaux.push(c);
      this.errorMsg = '';
      // reset form…
    },
    error: () => this.errorMsg = 'Erreur à l’ajout du créneau'
  });
}


onTypeChange() {
  this.newCreneau.filmId = null;
  this.newCreneau.heureFin = '';
  this.newCreneau.seminaireTitre = '';
  this.newCreneau.formateur = '';
}

//formatLocalDate convertit un Date en une chaîne ISO locale courte (YYYY-MM-DDThh:mm), en garantissant l’ajout de zéros pour les chiffres à un seul caractère
private formatLocalDate(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2,'0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
         + `T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }



}
