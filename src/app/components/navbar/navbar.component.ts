import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionStore } from '../../store/session-store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private sessionStore: SessionStore,
  ) {}

  get isLoggedIn(): boolean {
    return !!this.sessionStore.isUserLogged();
  }

  idiomaSeleccionado = 'es';

  isDropdownOpen = false;

  onIdiomaChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    this.idiomaSeleccionado = value;
    console.log('Idioma seleccionado:', value);
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.isDropdownOpen = false;
    this.sessionStore.logout();
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
