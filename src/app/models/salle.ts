// src/app/models/salle.ts
import { Cinema } from './cinema';

export interface Salle {
  idSalle:         number;
  capacite:        number;
  photo:           string;
  nbrSiegeStd:     number;
  nbrSiegeSpecial: number;
  nbrSiegePmr:     number;
  description:     string;
  calendriers:     any[];    
  cinema:          Cinema;
}
