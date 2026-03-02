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

  // ================================
  // CONSTRUCTOR
  // ================================

  constructor(private router: Router) {}

  // ================================
  // MÉTODOS
  // ================================

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode');
  }

  login(): void {
    this.isLoading = true;

    setTimeout(() => {
      alert('Login exitoso');
      this.isLoading = false;

      //Redirige el perfil
    this.router.navigate(['/profileUsers']);
    }, 2000); //2 segundos es lo que va a durar
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  exit(): void {
    // Si quieres limpiar sesión:
    // localStorage.clear();

    this.router.navigate(['/']);
  }

  //MUCHO OJITO
  //MUCHO OJITO
  //OJO ESTA PARTE ESTA BIEN ALTERADO PUES PARA QUE RESUELVA


  //PARA LA ANIMACCIÓN
    animationSpeed: number = 3000; // 3 segundos por ciclo
  isAnimating: boolean = true;
  
  // Método para cambiar la velocidad (opcional)
  setAnimationSpeed(speed: number): void {
    this.animationSpeed = speed;
    // Aquí podrías actualizar una variable CSS personalizada
    document.documentElement.style.setProperty('--animation-speed', `${speed}ms`);
  }
  
  // Método para pausar/reanudar (opcional)
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