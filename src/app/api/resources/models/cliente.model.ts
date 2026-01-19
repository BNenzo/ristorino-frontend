export interface Cliente {
  nroCliente: number;
  apellido: string;
  nombre: string;
  clave: string;
  correo: string;
  telefonos?: string;
  nroLocalidad: number;
  habilitado?: boolean;
}
