//ACTIVAMOS EL FORMS DEL LA RUTA

//lIBRERIAS QUE SE IMPORTARON
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { ProfileComponent } from './auth/profileUsers/profileUsers';
import { Bienvenida } from './auth/welcome/welcome';
import { EditProfileComponent } from './edit-profile/edit-profile';
import { Dashboard } from './dashboard/dashboard';
import {  CreatePostComponent} from './create-post/create-post';

//Las rutas
export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }, //redirección bienvenido
  { path: 'welcome', component: Bienvenida }, //Bienvenido
  //{ path: '', redirectTo: 'login', pathMatch: 'full' }, //redirección inicio

  //inicios de sesion 
  { path: 'login', component: LoginComponent }, //login
  {path: 'register', component: RegisterComponent}, //registro

  //Perfil
  {path: 'profileUsers', component: ProfileComponent}, //para el pefil xde usuario
  {path: 'edit-profile', component: EditProfileComponent}, //para editar el perfil

  // MenuPrincipal
  {path: 'dashboard', component: Dashboard}, //para el dashboad

  //posts:
  { path: 'create-post', component: CreatePostComponent},



];

/**NOTA:
 * 
 * ES IMPORTANTE VISUALIZAR COMOS SE LLAMAN CADA UNA LOS NOMBRES DE LOS COMPONENTES
 *  EN ESE CASO POR EL NOMBRE DE LA CLASE..
 * 
 * PARA QUE SE PUEDA IMPORTAR CORRECTAMENTE
 */