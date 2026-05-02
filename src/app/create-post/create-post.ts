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

  onFileSelected(event: any){
    const file = event.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.preview = reader.result;
      this.imageBase64 = reader.result;
    };

    reader.readAsDataURL(file);
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


      createdAt: this.postData?.createdAt || new Date()
    };

    this.postCreated.emit(newPost);
    this.close.emit();
    
  }

}