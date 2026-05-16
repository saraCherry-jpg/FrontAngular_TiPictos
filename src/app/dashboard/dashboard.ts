import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreatePostComponent } from '../create-post/create-post';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  
  imports: [CommonModule, CreatePostComponent, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {

  //constructor
  constructor(private router: Router){}

  //VARIABLES DECLARADAS:
  //Para post
  showCreatePost = false;
  posts: any[] = []; // POSTS

 //Para el boton de configuración
  showSettingsModal = false;  //Setting / configuración
  isDarkMode: boolean = false;  // DARK MODE


  //_______________________________   METODOS   _____________________________________________________
  //CARGA EL POST - DASAHBORAD

  //inicializa el dashboard
  ngOnInit(): void {
    this.loadPosts();
    this.loadTheme();

  }

  // CARGA EL TEMA OSCURO
  loadTheme() {
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

  //carga los poast
  loadPosts() {
    const savedPosts =
      JSON.parse(localStorage.getItem('myPosts') || '[]');

    this.posts = savedPosts;

  }

  // CREATE POST
  openCreatePost(){
    this.showCreatePost = true;
  }

  closeCreatePost(){
    this.showCreatePost = false;
  }


  //Recibe los post
  handleNewPost(post: any){

    this.loadPosts(); //regarga 'myPost'
    this.closeCreatePost(); // CERRAR MODAL
  }






  /*PD: LA IDEA ES QUE LA SUGERENCIA DE USUARIOS, APAREZCA USUARIOS EXISTENTES QUE YA SE ALLAN REGISTRADO
  CON ANTERIORIDAD Y PUES ESO SIGNIFICA QUE ESTAN DADOS DE ALTA LOS USUARIOS PARA PODERLOS SEGUIR.. */
  
  
  //nomas son de prueba xddd  --> mas delante se cambiará el codigo
  suggestedUsers = [
    {
      name: 'Sari',
      username: 'sari.glory'
    },

    {
      name: 'Rock',
      username: 'rock.light'
    },

    {
      name: 'Tempo',
      username: 'quakewoman'
    }
  ];


//SEGUIR USUARIOS
  followUser(user:any){
    console.log('Siguiendo a:', user);

    // localStorage actual
    const savedFollowing = JSON.parse(localStorage.getItem('following') || '[]');

    // evitar duplicados
    const alreadyFollowing =
      savedFollowing.some(
        (u:any) => u.username === user.username
      );

    if(!alreadyFollowing){

      savedFollowing.push(user);

      localStorage.setItem(
        'following',
        JSON.stringify(savedFollowing)
      );
    }
  }
  




  //___________________________________________ En las configuraciones _____________________________
  openSettingsModal() {
    this.showSettingsModal = true;
  }

  closeSettingsModal() {
    this.showSettingsModal = false;
  }



  // _______________________________________________ TEMA OSCURO  ________________________________________
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    if(this.isDarkMode){

      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');

      localStorage.setItem('theme', 'dark'); //lo almacena

    }else{

      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');

      localStorage.setItem('theme', 'light'); //lo almacena 
    }
  }


  //____________________________________ ACCEDER A PROFILE USER _________________________
 
  goToProfile(){
    this.router.navigate(['/profileUsers']);
  }

  //___________________________________________ Salir de Sesión / Cerrar Sesión / Logout ____________________________
  logout() {
    localStorage.removeItem('currentUser'); //Cerrar Sesion actualmente

    // opcional:
    // localStorage.clear();

    // redirección login
    this.router.navigate(['/login']);
  }

}
