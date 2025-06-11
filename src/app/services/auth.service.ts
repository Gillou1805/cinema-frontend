import { Injectable }       from '@angular/core';
import { HttpClient }       from '@angular/common/http';
import { BehaviorSubject,
         Observable,
         of,
         tap }               from 'rxjs';
import { catchError }       from 'rxjs/operators';

interface LoginResponse { token: string; }

@Injectable({ providedIn: 'root' }) // création d'un singleton global
export class AuthService {
  private apiUrlLogin    = 'http://localhost:8080/api/auth/login';
  private apiUrlRegister = 'http://localhost:8080/api/auth/register';
  private tokenKey       = 'authToken'; //clé sous laquelle on stocke le token en local

  // EN GROS: un BehaviorSubject permettre des émissions depuis l'exterieur, on dit que le récepteur est "abonné ( susbscribe) à l'émetteur"
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken()); //type particulier d'observable RxJS
  private roleSubject     = new BehaviorSubject<string | null>(this.decodeRole()); // Gardent en mémoire l’état courant (connecté/déconnecté, rôle, prénom).
  private nameSubject     = new BehaviorSubject<string | null>(this.decodePrenom()); //Offrent un mécanisme réactif pour que toute l’application se mette à jour automatiquement dès que l’état d’authentification change.  
                                                // string | null car strin = admin ou user donc un role et null pas de role
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrlLogin, { mail: email, mdp: password }) // construit un appel post, pour renvoyer un observable qui permet de récupérer le token.
      .pipe(  // pipe pour enchaîner et appliquer de manière déclarative tous les traitements (transformation, filtrage, side-effects, gestion d’erreur…) à un flux asynchrone d’un Observable, tout en gardant le code propre et facile à maintenir.
        tap(res => { //tap permet d’observer et d’agir sur les données émises par un Observable sans en changer le contenu, dans ce cas pour le stockage des valeurs
          localStorage.setItem(this.tokenKey, res.token); // On écrit le jeton dans le localStorage, pour qu’il survive au rechargement de la page.

          this.loggedInSubject.next(true);                //Après un login(), on fait .next(true) → tous les composants (navbar, boutons, guards, etc.) savent qu’ils doivent passer en mode « utilisateur connecté »
          this.roleSubject.next(this.decodeRole());       //La méthode next() est simplement la façon dont on envoie une nouvelle valeur à tous les abonnés d’un Subject (ou d’un BehaviorSubject dans ce cas).
          this.nameSubject.next(this.decodePrenom());    // Les subject possèdent leurs propre méthode, next en fait partie.
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey); //retire le token
    this.loggedInSubject.next(false);       // set le login subject sur false
    this.roleSubject.next(null);
    this.nameSubject.next(null);
  }

   /** Extrait le "sub" (subject) ou "username" du payload JWT */
 /* private decodeUsername(): string | null {
    const t = this.getToken();
    if (!t) return null;
    try {
      const p: any = JSON.parse(atob(t.split('.')[1]));
      return p.sub ?? p.username ?? null;
    } catch {
      return null;
    }
  }*/

  /** Observable du prénom extrait du JWT */
  getUsername(): Observable<string | null> { //getUsername() permet à n’importe quel composant d’écouter en continu les changements du prénom de l’utilisateur, sans pouvoir modifier lui-même cette donnée.
    return this.nameSubject.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable(); //transforme un Subject (ou un BehaviorSubject dans mon cas) en un Observable « classique »
  }

  /** Renvoie la valeur courante du rôle (ou null si aucun token) */
  getRoleValue(): string | null {
    return this.roleSubject.getValue();
  }

  getRole(): Observable<string | null> {
    return this.roleSubject.asObservable();
  }

  /** Récupère le token brut */
  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  checkEmail(mail: string): Observable<boolean> { // vérification asynchrone permettant de voir si un mail existe déja avant l inscription
    return this.http.get<boolean>(
      `http://localhost:8080/api/utilisateurs/exists?mail=${encodeURIComponent(mail)}`
    );
  }



  /** Extrait l’ID numérique de l’utilisateur depuis le JWT (claim "userId"). */
  public getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // selon claim "userId" ou "id" côté backend :
      return (payload.userId ?? payload.id) as number;
    } catch {
      return null;
    }
  }


  public register(
    nom: string,
    prenom: string,
    mail: string,
    mdp: string
  ): Observable<string> {
    const payload = { nom, prenom, mail, mdp };
    return this.http.post<string>(
      this.apiUrlRegister,
      payload,
      { responseType: 'text' as 'json' }
    );
  }

   private decodeRole(): string | null { // extrait le role depuis le payload du jwt
    const t = this.getToken(); if (!t) return null;
    try {
      const p: any = JSON.parse(atob(t.split('.')[1])); // T.split isole els parties et atob décode la chaine encodée en base 64 URL
      if (p.role) return p.role; // extrait le role
      if (Array.isArray(p.roles) && p.roles.length) return p.roles[0].replace(/^ROLE_/, ''); // prend uniquement le premier élément dans le cas ou c'est un taleau, en gros on retire Role_ et on prend ADMIN
      if (Array.isArray(p.authorities) && p.authorities.length) return p.authorities[0]; // on check au cas ou on aurait pris authorities au lieur de role
    } catch {}
    return null; // si token mal formé renvoie null
  }

  /** Lit le champ "prenom" du payload JWT */
  private decodePrenom(): string | null {
    const t = this.getToken(); if (!t) return null;
    try {
      const p: any = JSON.parse(atob(t.split('.')[1]));
      return p.prenom ?? null;
    } catch {
      return null;
    }
  }

}
