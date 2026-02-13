import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../api/resources/auth/models/usuario.model';
import { INITITAL_STATE, NRO_IDIOMA_KEY, TOKEN_KEY } from './constants';
import { AuthState } from './types';
import {
  CrearReservaDraftRequest,
  CrearReservaRequest,
} from '../api/resources/reserva/models/reserva.model';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly state = signal<AuthState>(INITITAL_STATE);

  // selectors
  readonly token = computed(() => this.state().token);
  readonly user = computed(() => this.state().user);
  readonly isUserLogged = computed(() => this.state().token && this.state().user);
  readonly reservaDraft = computed(() => this.state().reservaDraft);
  readonly nroIdioma = computed(() => this.state().nroIdioma);

  initFromStorage() {
    const nroIdioma = localStorage.getItem(NRO_IDIOMA_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) this.setToken(token);
    if (nroIdioma) this.setNroIdioma(Number(nroIdioma));
  }

  // actions
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this.state.update((s) => ({ ...s, token }));
  }

  setUser(user: Usuario) {
    this.state.update((s) => ({ ...s, user }));
  }

  setReservaDraft(reserva: CrearReservaDraftRequest) {
    this.state.update((s) => ({ ...s, reservaDraft: reserva }));
  }

  setNroIdioma(nroIdioma: number) {
    localStorage.setItem(NRO_IDIOMA_KEY, nroIdioma.toString());
    this.state.update((s) => ({ ...s, nroIdioma }));
  }

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    this.state.set(INITITAL_STATE);
  }

  clearReservaDraft() {
    this.state.update((s) => ({ ...s, reservaDraft: null }));
  }

  logout() {
    this.clearSession();
  }
}
