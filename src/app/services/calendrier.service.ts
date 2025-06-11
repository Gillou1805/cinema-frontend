// src/app/services/calendrier.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calendrier } from '../models/calendrier';
import { Creneau } from '../models/creneau';

@Injectable({
  providedIn: 'root'
})
export class CalendrierService {
  private apiUrl = 'http://localhost:8080/api/salles';

  constructor(private http: HttpClient) {}

  getCalendrierBySalle(idSalle: number): Observable<Calendrier> {
  return this.http.get<Calendrier>(`${this.apiUrl}/${idSalle}/calendrier`);
}


  getCreneaux(idSalle: number, idCalendrier: number): Observable<Creneau[]> {
    return this.http.get<Creneau[]>(`${this.apiUrl}/${idSalle}/calendrier/${idCalendrier}/creneaux`);
  }
}
