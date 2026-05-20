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
  postToDelete: any;

  //constructor
  constructor(private router: Router){}

  //VARIABLES DECLARADAS:
  //Para post
  activeModal: 'create' | 'preview' | 'edit' | null = null; // Seria el reemplazo de showCreatePost = false;
  posts: any[] = []; // POSTS

  //inrtereaciones post 
  selectedPost: any = null;
  newComment = '';
  username = '';
  avatar = '';

  editingPost: any = null;


 //Para el boton de configuración
  showSettingsModal = false;  //Setting / configuración
  isDarkMode: boolean = false;  // DARK MODE



  //_______________________________   METODOS   _____________________________________________________
  //CARGA EL POST - DASAHBORAD

  //inicializa el dashboard
  ngOnInit(): void {
    this.loadPosts();
    this.loadTheme();

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.username = currentUser.username || '';
    this.avatar = currentUser.avatar || '';

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

  //carga los post
  loadPosts() {
    const savedPosts =
      JSON.parse(localStorage.getItem('allPosts') || '[]');

    this.posts = savedPosts.sort(
      (a: any, b: any) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
    
  }

  // CREATE POST
  openCreatePost(){
    this.editingPost = null;
    this.activeModal = 'create';
  }

  closeCreatePost(){
    this.activeModal = null;
    this.editingPost = null;

  }


  //Recibe los post
  handleNewPost(post: any){

    this.loadPosts(); //regarga 'allPost'
    this.closeCreatePost(); // CERRAR MODAL
  }



  //Previstas del post
  openPostDetail(post: any) {
    this.selectedPost = post;
    this.activeModal = 'preview';
  }

  closePostDetail() {
    this.selectedPost = null;
    this.activeModal = null;
  }

  //___________________________________________   INTERACCIONES POSTS   ______________________________________________
  
  //Like/ Corazones
  toggleLike(post: any) {
    post.likes = post.likes || 0;

    if (!post.liked) {
      post.likes++;
      post.liked = true;

    } else {
      post.likes--;
      post.liked = false;

    }
    this.savePosts(post); //nomas agregamos el post
    
  }



  //Respot 
  repost(post: any) {
    if (!post.repostedBy) {
      post.repostedBy = [];
    }

    if (!post.repostedBy.includes(this.username)) {
      post.repostedBy.push(this.username);
      post.reposts = (post.reposts || 0) + 1;

    } else {
      post.repostedBy =
      post.repostedBy.filter(
        (u: string) => u !== this.username
      );

      post.reposts--;
    }

    this.savePosts(post); //se agrega el post
  }

  

  //Comentarios
  addComment(post: any) {
    if (!this.newComment.trim()) return;

      if (!post.comments) {
        post.comments = [];
      }

      post.comments.push({
      user: this.username,
      avatar: this.avatar,
      text: this.newComment,
      createdAt: new Date()

    });

    this.newComment = '';
    this.savePosts(post); //se agrega el post 
    
  }


  //Guarda la publicación 
  savePosts(updatedPost?: any) {
    const allPosts = JSON.parse(localStorage.getItem('allPosts') || '[]');

    // Si recibimos un post actualizado
    if(updatedPost){

      const updatedPosts = allPosts.map((p:any) =>
        p.id === updatedPost.id ? updatedPost : p
      );

      localStorage.setItem('allPosts',JSON.stringify(updatedPosts));
      this.posts = [...updatedPosts]; // reemplazo de this.posts = updatedPosts;
    } else {

      localStorage.setItem('allPosts', JSON.stringify(this.posts));
    }
  }


  //________________________________________    CRUD DEL POST   ________________________________________

  //Editar 
  editPost(post: any){
     this.selectedPost = null;
    this.editingPost = { ...post };
    this.activeModal = 'edit';
  }

  //Eliminar
  deletePost(post: any){
    this.postToDelete = post;
  }



  //CONFIRMA ELIMINACIÓN DEL POST
  confirmDelete() {
    if (!this.postToDelete) return;

    const allPosts = JSON.parse(localStorage.getItem('allPosts') || '[]');
    const updatedPosts = allPosts.filter((p: any) => p.id !== this.postToDelete.id);

    localStorage.setItem('allPosts', JSON.stringify(updatedPosts));

    this.loadPosts();
    this.postToDelete = null;
    this.selectedPost = null;
    this.activeModal = null;
 

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
    // localStorage.clear(); //Eso provoca un receteo del sistema xddd

    // redirección login
    this.router.navigate(['/login']);
  }

}
