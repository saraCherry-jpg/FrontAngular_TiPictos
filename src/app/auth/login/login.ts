import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  
  // ================================
  // VARIABLES
  // ================================

  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  isDarkMode: boolean = false;
  showPassword: boolean = false; //para la contraseña


  // CONSTRUCTOR
  constructor(private router: Router) {}

  // ================================
  // MÉTODOS
  // ================================

  ngOnInit(){ //Detecta el tema guardado

    const theme = localStorage.getItem('theme');

    if(theme === 'dark'){
      document.body.classList.add('dark-mode');
      this.isDarkMode = true;
    }else{
      document.body.classList.remove('dark-mode');
      this.isDarkMode = false;
    }

  }


  //Para la CONTRASEÑA 
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

 // ================================
  // CORREGIDO: Toggle Dark Mode
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
  // LOGIN  --> CONTROLADOR
  // ================================

  login(): void {

    // VALIDAR CAMPOS VACIOS
    if (!this.email || !this.password) {
      alert('Debe ingresar correo y contraseña');
      return;

      //Tambien que salga en el archivo (ya sea en el html o css, que ponga como un color rojito)
    }

    // BUSCAR USUARIO REGISTRADO
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userFound = users.find((u: any) => u.email === this.email);


    // SI EL USUARIO NO EXISTE
    if (!userFound) {
      alert('El usuario no existe. Debe registrarse primero.');
      return;
    }

    // VALIDAR CONTRASEÑA
    if (userFound.password !== this.password) {
      alert('Contraseña incorrecta');
      return;
    }


    // LOGIN CORRECTO
    this.isLoading = true;
    setTimeout(() => {
      alert('Login exitoso');
      
      //Guarda la sesión activada
      localStorage.setItem('currentUser', JSON.stringify(userFound));
      this.isLoading = false;

      // Redirige al perfil
      this.router.navigate(['/profileUsers']);

    }, 2000);

  } // FIN DEL METODO CONTROLADOR LOGIN

  // ================================
  // NAVEGACIÓN
  // ================================

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  exit(): void {
    this.router.navigate(['/']);
  }


  // ================================
  // ANIMACIÓN DEL LOGO
  // ================================

  animationSpeed: number = 3000; // 3 segundos por ciclo
  isAnimating: boolean = true;

  setAnimationSpeed(speed: number): void {

    this.animationSpeed = speed;

    document.documentElement
      .style
      .setProperty('--animation-speed', `${speed}ms`);

  }

  toggleAnimation(): void {

    this.isAnimating = !this.isAnimating;
    const frames = document.querySelectorAll('.frame');

    frames.forEach(frame => {

      if (this.isAnimating) {
        frame.classList.add('animate');
      } else {
        frame.classList.remove('animate');
      }

    });

  }

}