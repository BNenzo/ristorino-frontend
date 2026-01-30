export interface TurnoDisponible {
  nroRestaurante: number;
  nroSucursal: number;
  fechaReserva: string; // yyyy-MM-dd
  horaReserva: string; // HH:mm:ss
  horaHasta: string; // HH:mm:ss
  cantidadReservada: number;
  cupoDisponible: number;
  totalComensales: number;
  turnoHabilitado: number;
  turnoCerrado: number;
}
