export interface CrearReservaRequest {
  nroRestaurante: number;
  nroSucursal: number;
  fechaReserva: string; // yyyy-MM-dd
  horaReserva: string; // HH:mm:ss
  cantAdultos: number;
  cantMenores: number;
  codZona: string;
}

export interface CrearReservaDraftRequest {
  nroRestaurante?: number;
  nroSucursal?: number;
  fechaReserva?: string; // yyyy-MM-dd
  horaReserva?: string; // HH:mm:ss
  cantAdultos?: number;
  cantMenores?: number;
  codZona?: string;
}
