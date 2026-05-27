import { DisponibilidadZonaRow, ZonaDisponible } from '../../types';

export function agruparDisponibilidadPorZona(rows: DisponibilidadZonaRow[]): ZonaDisponible[] {
  const mapa = new Map<string, ZonaDisponible>();

  // for (const row of rows) {
  //   if (!mapa.has(row.codZona)) {
  //     mapa.set(row.codZona, {
  //       codZona: row.codZona,
  //       cantComensales: row.cantComensales,
  //       permiteMenores: row.permiteMenoresZona === 1,
  //       horarios: [],
  //     });
  //   }

  //   mapa.get(row.codZona)!.horarios.push({
  //     horaDesde: row.horaDesde,
  //     horaHasta: row.horaHasta,
  //     cantidadReservada: row.cantidadReservada,
  //     cupoDisponible: row.cupoDisponible,
  //   });
  // }

  return Array.from(mapa.values());
}
