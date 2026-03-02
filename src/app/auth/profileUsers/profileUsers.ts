import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-users',
  templateUrl: './profileUsers.html',
  styleUrls: ['./profileUsers.css']
})
export class ProfileComponent {

  posts = [
    { image: 'assets/imagenes/logoAni1.png' },
    { image: 'assets/imagenes/TiPictosLogo.png' }
  ];

  toggleTheme() {
    document.body.classList.toggle('dark-mode');
  }

}