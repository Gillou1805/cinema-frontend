import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalleListComponent }   from './components/salle-list/salle-list.component';
import { LoginComponent }       from './components/login/login.component';
import { AdminComponent }       from './components/admin/admin.component';
import { AuthGuard }            from './guards/auth.guard';
import { RegisterComponent }    from './components/register/register.component';


export const routes: Routes = [
  { path: 'salles', component: SalleListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },  // protégé
  { path: '', redirectTo: 'salles', pathMatch: 'full' },
  { path: '**', redirectTo: 'salles' } , // catch-all : redirige vers salles si route inconnue
  { path: 'register', component: RegisterComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
