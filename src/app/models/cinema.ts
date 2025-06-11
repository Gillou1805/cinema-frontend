// src/app/models/cinema.ts
import { Salle } from './salle';

export interface Cinema {
  idCinema:       number;
  nom:            string;
  adresse:        string;
  salles?:        Salle[];   //  évite le récursif lors de l’affichage
}
