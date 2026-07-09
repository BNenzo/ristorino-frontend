export interface PreferenciaSeleccionadaRequest {
  cod_categoria: string;
  nro_valor_dominio: number;
}

export interface RegistrarClienteConPreferenciasRequest {
  correo: string;
  nombre: string;
  apellido: string;
  dni: number;
  telefono?: string;
  nroLocalidad: number;
  password: string;
  preferencias: PreferenciaSeleccionadaRequest[];
}
