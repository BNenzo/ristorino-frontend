import { Usuario } from '../../api/resources/auth/models/usuario.model';

export type AuthState = {
  token: string | null;
  user: Usuario | null;
};
