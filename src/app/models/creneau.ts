// src/app/models/creneau.ts
import { Seminaire } from "./seminaire";
import { Film }      from "./film";

export interface Creneau {
  idCreneau:  number;
  type:       string;
  heureDebut: string;
  heureFin:   string;

  // pour type='seminaire'
  seminaire?: Seminaire;

  // ici on veut tout le Film, avec ses tarifs
  film?: Film;
}
