export interface DisponibilidadTurnos {
  nroRestaurante: number;
  nroSucursal: number;
  codZona: string;
  cantComensales: number;
  permiteMenores: number; // 0 o 1
  horaDesde: string; // "20:00:00"
  horaHasta: string; // "21:00:00"
  habilitado: number; // 0 o 1
  cantidadReservada: number;
  cupoDisponible: number;
}
