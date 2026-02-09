export interface CrearReservaRequest {
  nroCliente: number;
  nroRestaurante: number;
  nroSucursal: number;
  fechaReserva: string; // yyyy-MM-dd
  horaReserva: string; // HH:mm:ss
  cantAdultos: number;
  cantMenores: number;
}
