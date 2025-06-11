// src/app/services/film.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Film } from '../models/film';

@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private apiUrl = 'http://localhost:8080/api/films'; // ou l’URL configurée dans environment

  constructor(private http: HttpClient) { }

  // Récupère tous les films
  getAll(): Observable<Film[]> {
    return this.http.get<Film[]>(this.apiUrl);
  }

  // Récupère un film par ID
  getById(id: number): Observable<Film> {
    return this.http.get<Film>(`${this.apiUrl}/${id}`);
  }

  // Crée un nouveau film
  create(film: Film): Observable<Film> {
    return this.http.post<Film>(this.apiUrl, film);
  }

  // Met à jour un film existant
  update(id: number, film: Film): Observable<Film> {
    return this.http.put<Film>(`${this.apiUrl}/${id}`, film);
  }

  // Supprime un film
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

