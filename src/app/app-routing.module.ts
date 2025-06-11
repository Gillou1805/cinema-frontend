// src/app/app-routing.module.ts

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// pages publiques
import { SalleListComponent }   from './components/salle-list/salle-list.component';
import { LoginComponent }       from './components/login/login.component';
import { RegisterComponent }    from './components/register/register.component';

//pages clients
import { ClientMainPageComponent } from './components/client/main-page/main-page.component';

// espace admin
import { AdminComponent }       from './components/admin/admin.component';
import { AuthGuard }            from './guards/auth.guard';

// CRUD des salles (admin)
import { CreateSalleComponent } from './components/create-salle/create-salle.component';
import { EditSalleComponent }   from './components/edit-salle/edit-salle.component';

// Calendriers
import { CalendrierComponent }  from './components/calendrier/calendrier-list.component';

// AJOUT : CRUD des films (admin)
import { FilmListComponent }    from './components/film/film-list/film-list.component';
import { CreateFilmComponent }  from './components/film/create-film/create-film.component';
import { EditFilmComponent }    from './components/film/edit-film/edit-film.component';

// AJOUT : Gestion des utilisateurs (admin)
import { AdminUserManagementComponent } from './components/admin-user-management/admin-user-management.component'; // Importation du composant
import { FilmDetailComponent } from './components/client/film-detail/film-detail.component';
import { SeatSelectionComponent } from './components/seat-selection/seat-selection.component';

const routes: Routes = [
  // pages accessibles publiquement
  { path: 'salles',   component: SalleListComponent },
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },

   //  PAGE D’ACCUEIL CLIENT 
  { path: 'home', component: ClientMainPageComponent },
  { path: 'films/:id', component: FilmDetailComponent },
  // src/app/app-routing.module.ts 
{ path: 'client/creneau/:id/reservation', component: SeatSelectionComponent },



  // zone admin protégée par AuthGuard
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [ AuthGuard ],  // Cette route est protégée
    children: [
      // --- Gestion des salles ---
      { path: 'salles',               component: SalleListComponent    },
      { path: 'salles/create',        component: CreateSalleComponent },
      { path: 'salles/:id/edit',      component: EditSalleComponent   },
      // calendrier d’une salle
      { path: 'salles/:id/calendrier',component: CalendrierComponent  },

      // --- Gestion des films ---
      { path: 'films',                component: FilmListComponent    },
      { path: 'films/create',         component: CreateFilmComponent  },
      { path: 'films/:id/edit',       component: EditFilmComponent    },

      // --- Gestion des utilisateurs (admin) ---
      { path: 'users',                component: AdminUserManagementComponent }, // Nouvelle route

      // redirection par défaut dans /admin
      { path: '', redirectTo: 'salles', pathMatch: 'full' }
    ]
  },

  // redirections globales
  //{ path: '',   redirectTo: 'salles', pathMatch: 'full' },
  //{ path: '**', redirectTo: 'salles' }

  { path: '',   redirectTo: 'home',   pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
