export interface Film {
  idFilm?: number;
  titre: string;
  duree: number;
  description?: string;
  image?: string;
  prixSiegeStd: number;
  prixSiegeSpecial: number;
  prixSiegePmr: number;
  trailerUrl?: string;   
}
