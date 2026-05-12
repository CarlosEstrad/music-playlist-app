import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    loadChildren: () => import('./components/home/home-module').then(m => m.HomeModule) 
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];