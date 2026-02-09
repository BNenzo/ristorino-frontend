export interface ReservaCliente {
  nroReserva: number;
  nroRestaurante: number;
  razonSocial: string;
  nroSucursal: number;
  nomSucursal: string;
  horaReserva: string;
  codEstado: string;
  fechaReserva: string; // yyyy-MM-dd
  cantAdultos: number;
  codReservaSucursal: string;
}
