// src/app/models/reservation.ts
export interface Reservation {
  idReservation:    number;
  nbSiegeStd:       number;
  prixSiegeStd:     number;
  nbSiegeSpecial:   number;
  prixSiegeSpecial: number;
  nbSiegePmr:       number;
  prixSiegePmr:     number;
  seatIds: number[];
  user:             { idUser: number };
  creneau:          { idCreneau: number };
}
