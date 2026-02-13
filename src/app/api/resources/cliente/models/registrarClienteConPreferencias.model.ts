export interface RegistrarClienteConPreferenciasRequest {
  correo: string;
  nombre: string;
  apellido: string;
  dni: number;
  telefono?: string;
  nroLocalidad: number;
  password: string;
  preferencias: number[];
}
