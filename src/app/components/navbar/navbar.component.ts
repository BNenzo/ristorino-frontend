import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  idiomaSeleccionado = 'es';

  isLoggedIn = false;
  isDropdownOpen = false;

  constructor(private router: Router) {}

  onIdiomaChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    this.idiomaSeleccionado = value;
    console.log('Idioma seleccionado:', value);
  }

  login() {
    //this.isLoggedIn = true;
    //this.isDropdownOpen = false;
    //console.log('Usuario logueado');

    //CAMBIAR ACA PARA PERMUTAR ENTRE EL REDIRECT Y EL CAMBIO DE ICONO

    this.router.navigate(['/login']);
  }

  logout() {
    this.isLoggedIn = false;
    this.isDropdownOpen = false;
    console.log('Sesión cerrada');
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  misReservas() {
    this.isDropdownOpen = false;
    this.router.navigate(['/mis-reservas']);
  }
}
