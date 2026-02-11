import { Usuario } from '../../api/resources/auth/models/usuario.model';
import { CrearReservaRequest } from '../../api/resources/reserva/models/reserva.model';

export type AuthState = {
  token: string | null;
  user: Usuario | null;
  reservaDraft: CrearReservaRequest | null;
};
