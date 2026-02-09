import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../api/resources/auth/models/usuario.model';
import { INITITAL_STATE, TOKEN_KEY } from './constants';
import { AuthState } from './types';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly state = signal<AuthState>(INITITAL_STATE);

  // selectors
  readonly token = computed(() => this.state().token);
  readonly user = computed(() => this.state().user);

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

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    this.state.set(INITITAL_STATE);
  }

  logout() {
    this.clearSession();
  }
}
