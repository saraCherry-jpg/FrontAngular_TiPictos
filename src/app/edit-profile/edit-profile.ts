import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})


export class EditProfileComponent implements OnInit {

  //  DARK MODE
  isDarkMode: boolean = false;

  //  DATOS USUARIO
  name: string = '';
  username: string = '';
  avatar: string = '';
  bio: string = '';


  // MODAL FOTO PERFIL
  showPhotoModal: boolean = false;
  showPreview: boolean = false;
  tempAvatar: string = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef //esa variable lo debo de importar
  ){}

  // =========================
  // INIT
  // =========================
  ngOnInit(){
    this.loadUser();
    this.loadTheme();

  }

  // =========================
  // CARGAR USUARIO
  // =========================
  loadUser(){
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}'); //Users en sesión
      const users = JSON.parse(localStorage.getItem('users') || '[]'); //Todos los users

      // BUSCAR USER REAL ACTUALIZADO
      const realUser = users.find((u: any) => {

        return (
          (u.id && currentUser.id && u.id === currentUser.id)
          ||
          (u.username === currentUser.username)
        );

      });

      // SI EXISTE USER REAL
      if(realUser){

        this.name = realUser.name || '';
        this.username = realUser.username || '';
        this.avatar = realUser.avatar || '';
        this.bio = realUser.bio || '';

        // ACTUALIZAR currentUser
        localStorage.setItem('currentUser', JSON.stringify(realUser)
        );
      }

    } catch (error) {
      console.error('Error cargando usuario', error);
    }

    
  }

  // =========================
  // TEMA
  // =========================
  loadTheme(){
    const theme = localStorage.getItem('theme');

    if(theme === 'dark'){
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      this.isDarkMode = true;
    }else{
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      this.isDarkMode = false;
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    if(this.isDarkMode){
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme','dark');
    }else{
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem('theme','light');
    }

  }


  // =========================
  // MODAL FOTO
  // =========================
  openPhotoOptions(){
    this.showPhotoModal = true;
  }

  closePhotoOptions(){
    this.showPhotoModal = false;
    this.showPreview = false;
    this.tempAvatar = '';
  }


  // =========================
  // CAMBIAR FOTO / SELECCIONAR IMAGEN
  // =========================
  onAvatarSelected(event: any){

    const file = event.target.files[0];
    if(!file) return;

    if(!file.type.startsWith('image/')){
      alert('Solo imágenes');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.tempAvatar = reader.result as string;

      // ACTIVAR PREVIEW
      this.showPreview = true;

      // FORZAR REFRESCO DE VISTA (LA CLAVE)
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }



  // CONFIRMAR FOTO
  // =========================
  confirmAvatar(){
    this.avatar = this.tempAvatar;
    this.closePhotoOptions();
  }

  // =========================
  // ELIMINAR FOTO
  // =========================
  removeAvatar(){
    this.avatar = '';
    this.closePhotoOptions();
  }


  // =========================
  // GUARDAR: 
  // 1. Guardará el foto de perfil que desee insertar siempre y cuando no pase de los 5MB
  // 2. MOdera los usuarios
  // =========================
  saveChanges(){
    try{
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}'); //usuarios actuales
      const users = JSON.parse(localStorage.getItem('users') || '[]'); //todos los usuarios

      // NUEVO USER
      const updatedUser = {

        ...currentUser,

        name: this.name.trim(),
        username: this.username.trim(),
        avatar: this.avatar,
        bio: this.bio.trim()

      };

      // ACTUALIZAR ARRAY
      const updatedUsers = users.map((user: any) => {
        const sameUser =

          (
            user.id &&
            currentUser.id &&
            user.id === currentUser.id
          )

          ||

          (
            user.username === currentUser.username
          );

        return sameUser ? updatedUser : user;

      });

      // GUARDAR
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('currentUser',JSON.stringify(updatedUser));

      alert('Perfil actualizado correctamente');

      this.router.navigate(
        ['/profileUsers'],
        { replaceUrl: true }
      );

    }catch(error){
      console.error(error);
      alert('Error al guardar perfil');

    }
  }

  // =========================
  // CANCELAR -->  NO guarda nada, solo regresa
  // =========================
  goBack(){
    this.router.navigate(['/profileUsers'], { replaceUrl: true });
  }

}