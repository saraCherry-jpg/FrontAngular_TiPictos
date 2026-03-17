import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router'; //se agrego

@Component({
  selector: 'app-profile-users',
  standalone: true,
  imports: [CommonModule], //Se agrego
  templateUrl: './profileUsers.html', 
  styleUrls: ['./profileUsers.css']
})


export class ProfileComponent {
  //variables que funcionan como mapeo
  name: string = '';
  username: string = '';
  avatar: string = "";
  posts:any[] = [];
  //avatar: any;
  //logout: any;

  constructor(private router: Router){} //constructor de la ruta

ngOnInit(){

  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  this.name = user.name;
  this.username = user.username;
  this.avatar = user.avatar || '';


  const theme = localStorage.getItem('theme'); //me falto esta parte de agregar, pero es para que se guarde el tema 

  if(theme === 'dark'){
    document.body.classList.add('dark-mode');
  }else{
    document.body.classList.remove('dark-mode');
  }

  

  this.posts = [
    { image: 'assets/imagenes/PinkyRoll.png.jpeg' },
    { image: 'assets/imagenes/Kneesocks.png' },
    { image: 'assets/imagenes/Tempo.png' }
  ];

}

  //Para el tema de interfaz dark/ light
  toggleTheme(){
    document.body.classList.toggle('dark-mode');
  }


  // CERRAR SESIÓN
  logout(){
    localStorage.removeItem('currentUser');
    alert("Sesión cerrada");
    this.router.navigate(['/login']);

  }

}