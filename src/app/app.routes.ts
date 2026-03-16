//ACTIVAMOS EL FORMS DEL LA RUTA

//lIBRERIAS QUE SE IMPORTARON
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { ProfileComponent } from './auth/profileUsers/profileUsers';
import { Bienvenida } from './auth/welcome/welcome';

//Las rutas
export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }, //redirección bienvenido
  { path: 'welcome', component: Bienvenida }, //Bienvenido
  //{ path: '', redirectTo: 'login', pathMatch: 'full' }, //redirección inicio
  { path: 'login', component: LoginComponent }, //login
  {path: 'register', component: RegisterComponent}, //registro
  {path: 'profileUsers', component: ProfileComponent} //para el pefil xde usuario

];