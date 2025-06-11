// src/app/models/utilisateur.ts
export interface Utilisateur {
  idUser: number;         // <— on renomme ici
  nom:     string;
  prenom:  string;
  mail:    string;
  role:    'USER' | 'ADMIN';
}
