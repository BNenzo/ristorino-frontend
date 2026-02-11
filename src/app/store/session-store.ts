import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../api/resources/auth/models/usuario.model';
import { INITITAL_STATE, TOKEN_KEY } from './constants';
import { AuthState } from './types';
import { CrearReservaRequest } from '../api/resources/reserva/models/reserva.model';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly state = signal<AuthState>(INITITAL_STATE);

  // selectors
  readonly token = computed(() => this.state().token);
  readonly user = computed(() => this.state().user);
  readonly isUserLogged = computed(() => this.state().token && this.state().user);
  readonly reservaDraft = computed(() => this.state().reservaDraft);

  initFromStorage() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) this.setToken(token);
  }

  // actions
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this.state.update((s) => ({ ...s, token }));
  }

  setUser(user: Usuario) {
    this.state.update((s) => ({ ...s, user }));
  }

  setReservaDraft(reserva: CrearReservaRequest) {
    this.state.update((s) => ({ ...s, reservaDraft: reserva }));
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
