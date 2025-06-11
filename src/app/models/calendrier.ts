import { Creneau } from './creneau';

export interface Calendrier {
  id: {
    idCalendrier: number;
    idSalle: number;
  };
  date: string; // ISO date string
  creneaux: Creneau[];
}
