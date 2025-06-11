// src/app/services/creneau.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Creneau } from '../models/creneau';

@Injectable({
  providedIn: 'root'
})
export class CreneauService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // existant pour les salles/calendriers…
  getCreneaux(idSalle: number, idCalendrier: number): Observable<Creneau[]> {
    return this.http.get<Creneau[]>(
      `${this.apiUrl}/salles/${idSalle}/calendrier/${idCalendrier}/creneaux`
    );
  }

  /** Récupère un seul créneau par son ID, pour avoir film+tarifs */
  getCreneau(creneauId: number): Observable<Creneau> {
    return this.http.get<Creneau>(`${this.apiUrl}/creneaux/${creneauId}`);
  }

  // NOUVEAU : récupère les créneaux d'un film pour une date
  getByFilmAndDate(filmId: number, date: string): Observable<Creneau[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<Creneau[]>(
      `${this.apiUrl}/films/${filmId}/creneaux`,
      { params }
    );
  }

  // existants pour créer / modifier / supprimer s
  createCreneau(idSalle: number, idCalendrier: number, creneau: Creneau): Observable<Creneau> {
    return this.http.post<Creneau>(
      `${this.apiUrl}/salles/${idSalle}/calendrier/${idCalendrier}/creneaux`,
      creneau
    );
  }

  updateCreneau(idSalle: number, idCalendrier: number, idCreneau: number, creneau: Creneau): Observable<Creneau> {
    return this.http.put<Creneau>(
      `${this.apiUrl}/salles/${idSalle}/calendrier/${idCalendrier}/creneaux/${idCreneau}`,
      creneau
    );
  }

  deleteCreneau(idSalle: number, idCalendrier: number, idCreneau: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/salles/${idSalle}/calendrier/${idCalendrier}/creneaux/${idCreneau}`
    );
  }

  getOne(creneauId: number): Observable<Creneau> {
  return this.http.get<Creneau>(`${this.apiUrl}/creneaux/${creneauId}`);
}
}

