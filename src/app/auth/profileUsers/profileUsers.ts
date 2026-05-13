import { CommonModule } from '@angular/common';
import { Component,  OnInit } from '@angular/core';
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

export class ProfileComponent implements OnInit {

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

  //Nuevas variables para trabajar con Follow y followers
  showFollowersModal: boolean = false;
  showFollowingModal: boolean = false;

  followers: any[] = [];
  following: any[] = [];
  user: any;
   

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
    this.loadFollowers();

    //Carga el perfil
    this.loadPosts();


     

    window.addEventListener('focus', () => { //Recarga todo el profile cuando terminas de editars
      this.loadUser();
    }); 


    //Carga del tema oscuro
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
    /*
    const savedPosts = JSON.parse(localStorage.getItem('myPosts') || '[]');
    this.posts = savedPosts;
    */


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




  //Carga el post desde el profile
  loadPosts() {
    const savedPosts =
    JSON.parse(localStorage.getItem('myPosts') || '[]'); //mucho cuidado como declaras los parametros

    this.posts = savedPosts;
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


  //cargar el post


  //Carga Followers y Follow
  loadFollowers(){

    //Carga y almacena datos
    const savedFollowers =
      JSON.parse(localStorage.getItem('followers') || '[]');

    const savedFollowing =
      JSON.parse(localStorage.getItem('following') || '[]');

    //Asigna
    this.followers = savedFollowers;
    this.following = savedFollowing;

    


    //Son PRUEBAS TEMPORAL (Se supone que ya tenemos el login y register y pues podemos acceder)
    
    /*  PD: Mas delante hare las funcionalidaddes de true o false con el isFollowig:
     sin imporar el usuario que aparezca, ya que debe estar estar almacenados los usuarios
     en el sistema con el simple fin de que se encuentre registrando
     y por ende el boton lo pueda hacer funcional correctamente "seguir" "eliminar"  */
    

    /* 
    // DEMO TEMPORAL
    if(this.followers.length === 0){

      this.followers = [

        {
          name: 'Ana',
          username: 'ana_dev',
          avatar: '',
          isFollowing: false //no lo sigues 
        },

        {
          name: 'Luis',
          username: 'luis_art',
          avatar: '',
          isFollowing: true //si lo sigues 
        },

        {
          name: 'Carlos',
          username: 'carlos_js',
          avatar: '',
          isFollowing: false
        }

      ];

      this.following = this.followers.filter(
        u => u.isFollowing
      );
    }

    */
  }



  // ABRIR / CERRAR MODALS
  // =====================================
  openFollowersModal(){
    this.showFollowersModal = true;
  }

  closeFollowersModal(){
    this.showFollowersModal = false;
  }

  openFollowingModal(){
    this.showFollowingModal = true;
  }

  closeFollowingModal(){
    this.showFollowingModal = false;
  }



  // SEGUIR USUARIO
  // =====================================
  followUser(user: any){
    user.isFollowing = !user.isFollowing;

    // SI AHORA LO SIGUES
    if(user.isFollowing){

      const exists = this.following.find(
        u => u.username === user.username
      );

      if(!exists){
        this.following.push(user);
      }

    } else {

      // SI DEJAS DE SEGUIR
      this.following = this.following.filter(
        u => u.username !== user.username
      );
    }

    // GUARDAR FOLLOWING
    localStorage.setItem(
      'following',
      JSON.stringify(this.following)
    );

    // GUARDAR FOLLOWERS ACTUALIZADO
    localStorage.setItem(
      'followers',
      JSON.stringify(this.followers)
    );
  }


// ELIMINAR FOLLOWER
// =====================================
  removeFollower(user: any){

    this.followers =
      this.followers.filter(
        u => u.username !== user.username
      );

    localStorage.setItem(
      'followers',
      JSON.stringify(this.followers)
    );
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

    this.loadPosts();
    this.editingPost = null;
    this.closeCreatePost();

  }


  /*METODOS DE EDITAR Y ELIMINAR POST */
  deletePost(post: any){
    this.postToDelete = post;
  }

  //CONFIRMA ELIMINACIÓN DEL POST
  confirmDelete() {
    if (!this.postToDelete) return;
    this.posts = this.posts.filter(p => p !== this.postToDelete);

    localStorage.setItem('myPosts', JSON.stringify(this.posts)); //  faltaba esto (no estaba almacenando la eliminación xddd)   || cuidado como nombras los parametros ''

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

    localStorage.setItem('myPosts', JSON.stringify(this.posts)); //cuidar los parametros
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
    //cuida el nombre del parametro 'myPosts' evitalos y que todos sean iguales..

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


  //DASHBOARD
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }



  // CERRAR SESIÓN
  logout(){

    localStorage.removeItem('currentUser');
    alert("Sesión cerrada");
    this.router.navigate(['/login']);

  }

}