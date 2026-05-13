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



  // NUEVA FUNCIÓN PARA COMPRIMIR IMAGEN
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
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
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
      const compressedBase64 = await this.compressImage(file, 800, 0.6);
      this.preview = compressedBase64;
      this.imageBase64 = compressedBase64;
    } catch (error) {
      console.error('Error al comprimir la imagen:', error);
      alert('No se pudo procesar la imagen. Intenta con otra.');
    }

  }





  //  CREATE o EDIT
  publish(){

     const newPost = {
      id: this.postData ? this.postData.id : Date.now(), // mantiene ID si edita

      //Lo del perfil 
      user: this.postData?.user || 'Tú', // importante para profile
      avatar: this.postData?.avatar || null,

      type: this.type,
      description: this.description,

      //lo del hastag
      hashtags: this.hashtags
      ? this.hashtags.split(' ').filter(tag => tag.trim() !== '')
      : [],

      image: this.imageBase64 || null, //imagen


      // NUEVO agregados botones interactivos de las redes ()
      //pd: (evita NaN desde origen)
      likes: this.postData?.likes ?? 0, //corazones contados
      liked: this.postData?.liked ?? false, //conrazones 

      comments: this.postData?.comments ?? [], 

      reposts: this.postData?.reposts ?? 0,
      repostedBy: this.postData?.repostedBy ?? [], // restringe

      //fecha de publicacion
      createdAt: this.postData?.createdAt || new Date()
    };




    /* =========================================
    GUARDAR POSTS EN LOCALSTORAGE
    ========================================= */

    // obtener posts guardados
    const savedPosts = JSON.parse(localStorage.getItem('myPosts') || '[]'); //se modifico el parametro de 'post' a 'mypost'

    // si estamos editando
    if(this.mode === 'edit'){

      const updatedPosts = savedPosts.map((post:any) =>
        post.id === newPost.id ? newPost : post
      );

      localStorage.setItem('myPosts', JSON.stringify(updatedPosts) ); //lo actualiza 

    }else{

      // agregar nuevo post
      savedPosts.unshift(newPost);
      localStorage.setItem('myPosts', JSON.stringify(savedPosts));

    }

    this.postCreated.emit(newPost);
    this.close.emit();
    
  } catch (error: { name: string; }) {
      console.error('Error al publicar:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('No hay suficiente espacio de almacenamiento. La imagen es demasiado pesada o hay muchos posts antiguos. Prueba a eliminar algunos posts o usar imágenes más pequeñas.');
      } else {
        alert('Ocurrió un error al guardar la publicación.');
      }
  }

}