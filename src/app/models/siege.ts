// src/app/models/siege.ts
export interface Siege {
  id: number;           // id_siege, PK
  position: number;     // no_siege → vrai numéro dans la salle
  categorie?: string;   
  reservationId?: number;
}

