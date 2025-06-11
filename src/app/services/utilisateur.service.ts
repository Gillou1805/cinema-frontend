// src/app/services/utilisateur.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  private apiUrl = 'http://localhost:8080/api/utilisateurs'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  /** Récupère tous les utilisateurs */
  getAll(): Observable<Utilisateur[]> {
  return this.http.get<Utilisateur[]>(`${this.apiUrl}`);
}


  /** Met à jour le rôle d’un utilisateur */
  updateRole(userId: number, newRole: string): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${userId}/role`, { role: newRole });
  }

  /** Supprime un utilisateur */

delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

// src/app/services/auth.service.ts
checkEmail(mail: string): Observable<boolean> {
  return this.http.get<boolean>(`/api/utilisateurs/exists?mail=${encodeURIComponent(mail)}`);
}




  /** Crée un nouvel utilisateur */
  create(payload: {
    nom: string;
    prenom: string;
    mail: string;
    mdp: string;
    role: string;
  }): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}`, payload);
  }
}
