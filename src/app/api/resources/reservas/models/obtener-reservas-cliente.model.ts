export interface ObtenerReservasCliente {
  nroCliente: number;
  nroReserva: number;
  fechaHoraRegistro: string;
  fechaReserva: string;
  nroRestaurante: number;
  razonSocial: string;
  nroSucursal: number;
  nomSucursal: string;
  calle: string;
  nroCalle: number | null;
  barrio: string | null;
  codPostal: string | null;
  telefonosSucursal: string | null;
  codZona: string;
  horaReserva: string;
  cantAdultos: number;
  cantMenores: number;
  codEstado: string;
  estado: string;
  fechaCancelacion: string | null;
  costoReserva: number;
  codReservaSucursal: string;
}
