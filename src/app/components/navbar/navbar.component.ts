import { Component, inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionStore } from '../../store/session-store';
import { IdiomasResource } from '../../api/resources/idiomas/idiomas-resource';
import { Idiomas } from '../../api/resources/idiomas/models/idiomas.model';
import { FormsModule } from '@angular/forms';
import { NRO_IDIOMA_POR_LOCALE, URL_POR_NRO_IDIOMA_MAP } from '../../constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [IdiomasResource],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  private locale = inject(LOCALE_ID);

  idiomas: Idiomas[] = [];
  idiomaSeleccionado?: number;
  constructor(
    private router: Router,
    private sessionStore: SessionStore,
    private idiomaResource: IdiomasResource,
  ) {}

  ngOnInit(): void {
    this.idiomaResource.getIdiomas().subscribe({
      next: (response) => {
        this.idiomas = response;

        this.idiomaSeleccionado = NRO_IDIOMA_POR_LOCALE[this.locale];
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
    const value = Number(select.value);

    this.idiomaSeleccionado = value;

    const nuevaUrl = URL_POR_NRO_IDIOMA_MAP[value];

    if (nuevaUrl) {
      window.location.href = nuevaUrl + window.location.pathname + window.location.search;
    } else {
      window.location.reload();
    }
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
