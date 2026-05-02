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
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.name = user.name || '';
    this.username = user.username || '';
    this.avatar = user.avatar || '';
    this.bio = user.bio || '';
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
  // GUARDAR
  // =========================
  saveChanges(){

    const updatedUser = {
      name: this.name,
      username: this.username,
      avatar: this.avatar,
      bio: this.bio
    };

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    alert('Perfil actualizado');

    // IMPORTANTE: reemplaza historial (más pro)
    this.router.navigate(['/profileUsers'], { replaceUrl: true });

  }

  // =========================
  // CANCELAR -->  NO guarda nada, solo regresa
  // =========================
  goBack(){
    this.router.navigate(['/profileUsers'], { replaceUrl: true });
  }

}