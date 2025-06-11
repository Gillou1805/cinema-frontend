// src/app/models/reservation-dto.ts
export interface ReservationDto {
  userId:        number;
  nbSiegeStd:    number;
  nbSiegeSpecial:number;
  nbSiegePmr:    number;
  seatIds:       number[];
}
