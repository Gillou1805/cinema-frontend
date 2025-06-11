// src/app/services/salle.service.ts
import { Injectable }           from '@angular/core';
import { HttpClient }           from '@angular/common/http';
import { Observable }           from 'rxjs';
import { Salle }                from '../models/salle';

@Injectable({ providedIn: 'root' })
export class SalleService {
  private apiUrl = 'http://localhost:8080/api/salles';

  constructor(private http: HttpClient) {}

  /** Toutes les salles */
  getAll(): Observable<Salle[]> {
    return this.http.get<Salle[]>(this.apiUrl);
  }

  /** Une salle par son id */
  getById(id: number): Observable<Salle> {
    return this.http.get<Salle>(`${this.apiUrl}/${id}`);
  }

  /** Création */
  create(salle: Omit<Salle, 'idSalle'>): Observable<Salle> {
    return this.http.post<Salle>(this.apiUrl, salle);
  }

  /** Mise à jour */
  update(id: number, salle: Partial<Salle>): Observable<Salle> {
    return this.http.put<Salle>(`${this.apiUrl}/${id}`, salle);
  }

  /** Suppression  */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

