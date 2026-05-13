import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreatePostComponent } from '../create-post/create-post';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  
  imports: [CommonModule, CreatePostComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {

  //constructor
  constructor(private router: Router){}

  //VARIABLES DECLARADAS:
  showCreatePost = false;
  posts: any[] = []; // POSTS


  //_______________________________   METODOS   _____________________________________________________
  //CARGA EL POST - DASAHBORAD

  //inicializa el dashboard
  ngOnInit(): void {
    this.loadPosts();
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
  


  //____________________________________ ACCEDER A PROFILE USER _________________________
 
  goToProfile(){
    this.router.navigate(['/profileUsers']);
  }

}
