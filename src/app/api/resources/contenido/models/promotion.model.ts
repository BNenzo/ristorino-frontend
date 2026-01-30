export interface Promotion {
  barrio: string;
  calle: string;
  codContenidoRestaurante: string;
  contenidoAPublicar: string;
  contenidoPromocional: string;
  costoClick: number;
  cuit: string;
  fechaFinVigencia: string;
  fechaIniVigencia: string;
  imagenPromocional: string;
  nomLocalidad: string;
  nomProvincia: string;
  nomSucursal: string;
  nroCalle: number;
  nroContenido: number;
  nroIdioma: number;
  nroRestaurante: number;
  nroSucursal: number;
  razonSocial: string;
  totalClicks: number;
  totalCostoClicks: number;
  ultimaInteraccion: string | null;
}
