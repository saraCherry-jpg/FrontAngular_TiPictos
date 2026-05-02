import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CreatePostComponent } from '../../create-post/create-post';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-profile-users',
  standalone: true,
  imports: [CommonModule, CreatePostComponent, FormsModule],
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
  bio: any;
  editingPost: any = null;
  postToDelete: any;
  newComment: string = '';

  constructor(private router: Router){}

  // ================================
  // INICIALIZACIÓN

  goToEditProfile() {
    console.log("CLICK FUNCIONA"); //SOLO PARA PRUEBA
    this.router.navigate(['/edit-profile']); //Con esto navego el editar perfil xd

  }

  ngOnInit(){

    //localStorage.removeItem('myPosts'); //prueba BORRO TODO LOS POST QUE TENIA PUBLICADO XD
    this.loadUser();

    window.addEventListener('focus', () => { //Recarga todo el profile cuando terminas de editars
      this.loadUser();
    }); 

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

    //PARA QUE GUARDE LA PUBLICACIÓN CORRECTAMENTE
    const savedPosts = JSON.parse(localStorage.getItem('myPosts') || '[]');
    this.posts = savedPosts;


    //arregla los comentarios viejos
    this.posts = this.posts.map(post => ({
      ...post,
      comments: (post.comments || []).map((c: any) => {
    
        // si ya es objeto → lo dejamos
        if (typeof c === 'object') return c;

          // si es string → lo convertimos
        return {
          id: Date.now() + Math.random(),
          text: c,
          user: 'Usuario',
          avatar: null,
          createdAt: new Date()
        };
      })
    }));

  }

  /*Cargar usuario y arrastra los datos*/
  loadUser() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    console.log("USER:", user); //  DEBUG

    this.name = user.name;
    this.username = user.username;
    this.avatar = user.avatar || '';
    this.bio = user.bio || '';
  }


  /*PARA ABRIR O CERRAR EN CREAR PUBLICACIÓN */
  showCreatePost: boolean = false;

  openCreatePost(){
    console.log("SE ABRE MODAL");
    this.showCreatePost = true;
  }

  closeCreatePost(){
    this.showCreatePost = false;
  }


  /*PARA RECIBIR EL POST*/
  handleNewPost(post: any){
    if(this.editingPost){
      const index = this.posts.findIndex(p => p.id === post.id); //editar

      if(index !== -1){
        this.posts[index] = post;
      }
      this.editingPost = null;

    } else {
      this.posts.unshift(post); //crear
    }
    localStorage.setItem('myPosts', JSON.stringify(this.posts));
  }


  /*METODOS DE EDITAR Y ELIMINAR POST */
  deletePost(post: any){
    this.postToDelete = post;
  }

  //CONFIRMA ELIMINACIÓN DEL POST
  confirmDelete() {
    if (!this.postToDelete) return;
    this.posts = this.posts.filter(p => p !== this.postToDelete);

    localStorage.setItem('myPosts', JSON.stringify(this.posts)); //  faltaba esto (no estaba almacenando la eliminación xddd)

    this.postToDelete = null;
    this.selectedPost = null; //  cerrar modal también
  }


  editPost(post: any){
    this.selectedPost = null;   //  CIERRA el modal actual
    this.editingPost = post;   // guardamos el post a editar
    this.showCreatePost = true; // abrimos el modal reutilizado
  }
    

  /*Metodo de abrir o cerrar el post previamente*/
  selectedPost: any = null;
  
  openPostDetail(post: any){
    this.selectedPost = post;
  }

  closePostDetail(){
    this.selectedPost = null;
  }


  //BOTONES INTERACTIVOS ---> Corazones, Comentarios y Repost

  //Corazones
  toggleLike(post: any) { //el parametro es post no args
     post.liked = !post.liked;

    if(post.liked){
      post.likes++;
    } else {
      post.likes--;
    }

    localStorage.setItem('myPosts', JSON.stringify(this.posts));
  }

  //______________________  COMENTARIOS __________________________
  //Agregar Comentarios
  addComment(post: any) { //el parametro es post no args

    if (!this.newComment.trim()) return;

      if (!post.comments) {
        post.comments = [];
      }

      const newComment = {
      id: Date.now(),
      text: this.newComment,
      user: this.username,
      avatar: this.avatar,
      createdAt: new Date()
    };

    post.comments.push(newComment); //Ya almcena de forma segura
    this.newComment = '';

    localStorage.setItem('myPosts', JSON.stringify(this.posts));

  }

  //opciones (eliminar o cancelar )
  toggleCommentMenu(comment: any) {
    comment.showMenu = !comment.showMenu;
    
  }
  
  //Eliminar Comentarios
  deleteComment(post: any, comment: any) {
    post.comments = post.comments.filter((c: any) => c.id !== comment.id);

    localStorage.setItem('myPosts', JSON.stringify(this.posts));
    
  }


  


  //Repost
  repost(post: any) { //el parametro es post no args
     const currentUser = this.username;

    // inicializar si no existe
    if (!post.repostedBy) {
      post.repostedBy = [];
    }

    const alreadyReposted = post.repostedBy.includes(currentUser);

    if (alreadyReposted) {
      //  QUITAR REPOST
      post.repostedBy = post.repostedBy.filter((u: string) => u !== currentUser);
      post.reposts = Math.max((post.reposts || 1) - 1, 0);

    } else {
      //  HACER REPOST
      post.repostedBy.push(currentUser);
      post.reposts = (post.reposts || 0) + 1;
    }
    
    localStorage.setItem('myPosts', JSON.stringify(this.posts));
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