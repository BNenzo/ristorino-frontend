import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionStore } from '../../store/session-store';
import { IdiomasResource } from '../../api/resources/idiomas/idiomas-resource';
import { Idiomas } from '../../api/resources/idiomas/models/idiomas.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [IdiomasResource],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  idiomas: Idiomas[] = [];
  idiomaSeleccionado?: number;
  constructor(
    private router: Router,
    private sessionStore: SessionStore,
    private idiomaResource: IdiomasResource,
  ) {}

  ngOnInit(): void {
    console.log('Test', Number(this.sessionStore.nroIdioma()));
    this.idiomaResource.getIdiomas().subscribe({
      next: (response) => {
        console.log({});
        this.idiomas = response;

        this.idiomaSeleccionado = this.sessionStore.nroIdioma();
      },
      error: (err) => console.error(err),
    });
  }

  get isLoggedIn(): boolean {
    return !!this.sessionStore.isUserLogged();
  }

  isDropdownOpen = false;

  onIdiomaChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    this.idiomaSeleccionado = Number(value);
    this.sessionStore.setNroIdioma(Number(value));
    window.location.reload();
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
