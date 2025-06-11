// src/app/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation';
import { ReservationDto } from '../models/reservation-dto';
import { Siege } from '../models/siege';
import { Creneau }      from '../models/creneau';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  /** Récupère toutes les réservations pour un créneau */
  getByCreneau(creneauId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.apiUrl}/creneaux/${creneauId}/reservations`
    );
  }

  /** Récupère les sièges déjà réservés pour un créneau */
  getSieges(creneauId: number): Observable<Siege[]> {
    return this.http.get<Siege[]>(
      `${this.apiUrl}/creneaux/${creneauId}/sieges`
    );
  }

  /** Récupère tous les sièges déjà réservés pour un créneau */
getTakenSeats(creneauId: number): Observable<Siege[]> {
  return this.http.get<Siege[]>(
    `${this.apiUrl}/creneaux/${creneauId}/sieges`
  );
}

getOneCreneau(creneauId: number): Observable<Creneau> {
   return this.http.get<Creneau>(
     `${this.apiUrl}/creneaux/${creneauId}`
   );
 }



/** POST /api/creneaux/{id}/reservations */
createReservation(creneauId: number, dto: ReservationDto): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/creneaux/${creneauId}/reservations`,
    dto
  );
}

  /** Crée une réservation (avec seatIds) */
  create(creneauId: number, dto: ReservationDto): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/creneaux/${creneauId}/reservations`,
      dto
    );
  }
}
