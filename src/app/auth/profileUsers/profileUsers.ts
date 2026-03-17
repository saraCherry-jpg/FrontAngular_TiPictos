import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profileUsers.html', 
  styleUrls: ['./profileUsers.css']
})

export class ProfileComponent {

  // VARIABLES
  name: string = '';
  username: string = '';
  avatar: string = '';
  posts:any[] = [];
  isDarkMode: boolean = false; 

  constructor(private router: Router){}

  // ================================
  // INICIALIZACIÓN

  ngOnInit(){

    // USUARIO
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.name = user.name;
    this.username = user.username;
    this.avatar = user.avatar || '';


    // ================================
    // DETECTAR TEMA GUARDADO
    // ================================

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

    // POSTS
    this.posts = [
      { image: 'assets/imagenes/PinkyRoll.png.jpeg' },
      { image: 'assets/imagenes/Kneesocks.png' },
      { image: 'assets/imagenes/Tempo.png' }
    ];

  }


  // CAMBIAR TEMA (CORREGIDO)
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


  // CERRAR SESIÓN
  logout(){

    localStorage.removeItem('currentUser');
    alert("Sesión cerrada");
    this.router.navigate(['/login']);

  }

}