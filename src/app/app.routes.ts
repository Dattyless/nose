import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from '@auth0/auth0-angular';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./principio/principio.page').then(m => m.PrincipioPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'preguntas',
    loadComponent: () => import('./preguntas/preguntas.page').then(m => m.PreguntasPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'gameover',
    loadComponent: () => import('./gameover/gameover.page').then(m => m.GameoverPage),
    canActivate: [AuthGuard]
  },
  {
  path: 'home',
  loadComponent: () => import('./home/home.page').then( m => m.HomePage),
  canActivate: [AuthGuard]
  },
{
  path: 'dificultad',
  loadComponent: () => import('./dificultad/dificultad.page').then( m => m.DificultadPage),
  canActivate: [AuthGuard]
},
  {
    path: 'gamewon',
    loadComponent: () => import('./gamewon/gamewon.page').then(m => m.GamewonPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage),
  },
  {
    path: 'dificil',
    loadComponent: () => import('./dificil/dificil.page').then( m => m.DificilPage)
  },
  {
    path: 'facil',
    loadComponent: () => import('./facil/facil.page').then( m => m.FacilPage)
  },
];
