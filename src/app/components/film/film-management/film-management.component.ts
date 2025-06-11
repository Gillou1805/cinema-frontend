// src/app/components/film/film-management/film-management.component.ts

import { Component, OnInit } from '@angular/core';
import { FilmService } from '../../../services/film.service';
import { Film } from '../../../models/film';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-film-management',
  templateUrl: './film-management.component.html',
  styleUrls: ['./film-management.component.css']
})
export class FilmManagementComponent implements OnInit {

  films: Film[] = [];
  editingFilm: Film = { titre: '', duree: 0, description: '',prixSiegeStd:0,prixSiegeSpecial:0, prixSiegePmr:0, image:''};
  isEditing = false;

  constructor(
    private filmService: FilmService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Ici, on récupère la valeur "synchronisée" du rôle
    const role = this.authService.getRoleValue();
    if (role !== 'ADMIN') {
      this.router.navigate(['/salles']);
      return;
    }
    this.loadAllFilms();
  }

  // Charge tous les films depuis le backend
  loadAllFilms(): void {
    this.filmService.getAll().subscribe({
      next: (data: Film[]) => this.films = data,
      error: err => console.error('Erreur lors du chargement des films', err)
    });
  }

  // Passe en mode création : réinitialise l'objet editingFilm
  initCreate(): void {
    this.isEditing = true;
    this.editingFilm = { titre: '', duree: 0, description: '',prixSiegeStd:0,prixSiegeSpecial:0, prixSiegePmr:0, image:''};
  }

  // Passe en mode édition : copie les valeurs du film sélectionné
  initEdit(film: Film): void {
    this.isEditing = true;
    // On clone pour ne pas modifier directement la liste si on annule
    this.editingFilm = { ...film };
  }

  // Annule l'édition / création en cours
  cancel(): void {
    this.isEditing = false;
    this.editingFilm = { titre: '', duree: 0, description: '',prixSiegeStd:0,prixSiegeSpecial:0, prixSiegePmr:0, image:''};
  }

  // Soumet le formulaire : crée ou met à jour selon la présence de idFilm
  onSubmit(): void {
    if (this.editingFilm.idFilm) {
      // Mise à jour
      this.filmService.update(this.editingFilm.idFilm, this.editingFilm).subscribe({
        next: updated => {
          this.isEditing = false;
          this.loadAllFilms();
        },
        error: err => console.error('Erreur lors de la mise à jour du film', err)
      });
    } else {
      // Création
      this.filmService.create(this.editingFilm).subscribe({
        next: created => {
          this.isEditing = false;
          this.loadAllFilms();
        },
        error: err => console.error('Erreur lors de la création du film', err)
      });
    }
  }

  // Supprime un film (après confirmation)
  onDelete(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce film ?')) {
      this.filmService.delete(id).subscribe({
        next: () => this.loadAllFilms(),
        error: err => console.error('Erreur lors de la suppression du film', err)
      });
    }
  }
}
