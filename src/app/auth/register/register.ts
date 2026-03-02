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
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
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

  register(): void {

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      alert('Registro exitoso');
      this.isLoading = false;
      this.router.navigate(['/login']);
    }, 2000);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

}