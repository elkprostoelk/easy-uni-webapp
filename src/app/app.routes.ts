import { Routes } from '@angular/router';
import {WelcomePageComponent} from './components/welcome-page/welcome-page.component';
import {LoginComponent} from './components/login/login.component';

export const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'login', component: LoginComponent }
];
