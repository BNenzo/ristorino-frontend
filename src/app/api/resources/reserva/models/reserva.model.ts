// REVISAR!!!

export interface CrearReservaRequest {
  nroRestaurante: number;
  nroSucursal: number;
  fechaReserva: string; // yyyy-MM-dd
  horaDesde: string; // HH:mm:ss
  cantidadPersonas: number;
}
