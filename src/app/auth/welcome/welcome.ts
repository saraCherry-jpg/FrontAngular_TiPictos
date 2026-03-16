import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports:[NgClass],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css']
})



export class Bienvenida {

  isDarkMode = false;

  constructor(private router:Router){}

  ngOnInit(){

    const theme = localStorage.getItem('theme');

    if(theme === 'dark'){
      document.body.classList.add('dark-mode');
      this.isDarkMode = true;
    }

  }

  toggleTheme(){

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

//Permite tener la navegación del siguiente frame
  goToLogin(){
    this.router.navigate(['/login']);
  }

}