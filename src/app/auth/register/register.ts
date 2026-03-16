import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})

export class RegisterComponent {

  // ================================
  // VARIABLES
  // ================================

  name: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  isLoading: boolean = false;
  isDarkMode: boolean = false;
  showPassword: boolean = false;
goToRegister: any;
exit: any;

  constructor(private router: Router) {}

  // ================================
  // DETECTAR TEMA GUARDADO
  // ================================

  ngOnInit(){

    const theme = localStorage.getItem('theme');

    if(theme === 'dark'){
      document.body.classList.add('dark-mode');
      this.isDarkMode = true;
    }else{
      document.body.classList.remove('dark-mode');
      this.isDarkMode = false;
    }

  }

  // ================================
  // CAMBIAR TEMA
  // ================================

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

  // ================================
  // MOSTRAR / OCULTAR PASSWORD
  // ================================

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }

  // ================================
  // REGISTRO DE USUARIO
  // ================================

  register(): void {

    // VALIDAR CAMPOS VACÍOS
    if(!this.name || !this.username || !this.email || !this.password || !this.confirmPassword){

      alert('Todos los campos son obligatorios');
      return;

    }

    // VALIDAR CONTRASEÑAS
    if(this.password !== this.confirmPassword){

      alert('Las contraseñas no coinciden');
      return;

    }

    // OBTENER USUARIOS GUARDADOS
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // VERIFICAR SI EL EMAIL YA EXISTE
    const userExists = users.find((u:any) => u.email === this.email);

    if(userExists){

      alert('Este correo ya está registrado');
      return;

    }

    // CREAR NUEVO USUARIO
    const newUser = {

      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password

    };

    // GUARDAR USUARIO
    users.push(newUser);

    localStorage.setItem('users', JSON.stringify(users));

    this.isLoading = true;

    setTimeout(() => {

      alert('Registro exitoso');

      this.isLoading = false;

      this.router.navigate(['/login']);

    },1500);

  }

  // ================================
  // IR A LOGIN
  // ================================

  goToLogin(): void {

    this.router.navigate(['/login']);

  }

}