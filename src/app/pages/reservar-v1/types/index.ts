export interface DisponibilidadZonaRow {
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

// Esto lo armás vos en el componente a partir del flat
export interface ZonaDisponible {
  codZona: string;
  cantComensales: number;
  permiteMenores: boolean; // true si permiteMenoresZona === 1
  horarios: HorarioDisponible[];
}

export interface HorarioDisponible {
  horaDesde: string;
  horaHasta: string;
  cantidadReservada: number;
  cupoDisponible: number;
}
