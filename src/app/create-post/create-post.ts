import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.html',
  styleUrls: ['./create-post.css']
})
export class CreatePostComponent implements OnChanges {

  @Output() close = new EventEmitter<void>();
  @Output() postCreated = new EventEmitter<any>();

  //  NUEVO → para editar
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() postData: any = null;

  type: 'text' | 'image' = 'text';
  description: string = '';
  hashtags: string = '';
  preview: any = null;
  imageBase64: any = null;

  //user: undefined; //nueva variable para el user
  //isEditMode: boolean = false;

  //  Detecta cuando llega un post
  ngOnChanges(changes: SimpleChanges): void {

    //  SI ESTAMOS EDITANDO, CARGAMOS DATOS
    if (this.mode === 'edit' && this.postData) {
      this.description = this.postData.description || '';
      this.hashtags = this.postData.hashtags?.join(' ') || '';
      this.imageBase64 = this.postData.image || null;
      this.preview = this.postData.image || null;
      this.type = this.postData.type || 'text';
    }
  }



  // NUEVA FUNCIÓN PARA COMPRIMIR IMAGEN: SON LOS FORMATOS QUE UNO PUEDE TRABAJAR (PNG, JPG, WEB)
  compressImage(file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {

        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality); //0.2 //Con eso Identificamos los tipos de img
          resolve(compressedBase64);
        };
      };
    });
  }



  // MODIFICADO: ahora comprime la imagen antes de guardarla
  async onFileSelected(event: any){
    const file = event.target.files[0];
    if(!file) return;

    //excepciones para que marque error en caso de que la imagen no comprima correctamente... 
    try {
      const compressedBase64 = await this.compressImage(file, 800, 0.6); //300, 0.2
      this.preview = compressedBase64;
      this.imageBase64 = compressedBase64;
    } catch (error) {
      console.error('Error al comprimir la imagen:', error);
      alert('No se pudo procesar la imagen. Intenta con otra.');
    }

  }





  //____________________________________________________ CREATE o EDIT  ___________________________________________________
  publish(){
    try {
      const currentUser =JSON.parse(localStorage.getItem('currentUser') || '{}');

      const newPost = {

        id: this.postData
          ? this.postData.id
          : Date.now(),

        user: currentUser.username,
        // avatar: currentUser.avatar || null, //cuello xd
        type: this.type,
        description: this.description,

        hashtags: this.hashtags
          ? this.hashtags
              .split(' ')
              .filter(tag => tag.trim() !== '')
          : [],

        image: this.imageBase64 || null, //imagen: permite nomas subir imagenes con menores a 5MB

        likes: this.postData?.likes ?? 0,
        liked: this.postData?.liked ?? false,

        comments: this.postData?.comments ?? [],

        reposts: this.postData?.reposts ?? 0,
        repostedBy: this.postData?.repostedBy ?? [],

        createdAt:
        this.postData?.createdAt || new Date()
      };

      // POSTS GUARDADOS
      const savedPosts = JSON.parse(localStorage.getItem('allPosts') || '[]');
 
      //Validación oara editar la publicación
      if(this.mode === 'edit'){

        const updatedPosts =
          savedPosts.map((post:any) =>

            post.id === newPost.id
              ? newPost
              : post
          );

        localStorage.setItem('allPosts', JSON.stringify(updatedPosts)); //actualiza
      } else {

        // NUEVO POST
        savedPosts.unshift(newPost); //incluye: comentarios, likes, repost, avatar, la imagen Base64
        localStorage.setItem('allPosts', JSON.stringify(savedPosts)); //lo aguarda y almacena...
      }

      // EVENTOS
      this.postCreated.emit(newPost);
      this.close.emit();

    } catch(error: any){

      console.error('Error al publicar:', error);

      if(
        error instanceof DOMException &&
        error.name === 'QuotaExceededError'
      ){
        alert('No hay suficiente espacio de almacenamiento.');

      } else {
        alert('Ocurrió un error al guardar la publicación.');
      }
    }



  }
    

}