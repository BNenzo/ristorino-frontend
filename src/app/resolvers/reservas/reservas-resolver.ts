import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ObtenerReservasCliente } from '../../api/resources/reservas/models/obtener-reservas-cliente.model';
import { ReservasResource } from '../../api/resources/reservas/reservas-resource';
import { ObtenerEstadosReserva } from '../../api/resources/reservas/models/obtener-estados-reserva.model';
import { ReservaResource } from '../../api/resources/reserva/reserva-resource';
import { ReservaCliente } from '../../api/resources/reserva/models/reserva-cliente.model';
import { TurnoDisponible } from '../../api/resources/reserva/models/turno-disponible.model';
import { map, switchMap } from 'rxjs';

export const obtenerReservasClienteResolver: ResolveFn<ObtenerReservasCliente[]> = (route) => {
  return inject(ReservasResource).getReservasCliente();
};

export const obtenerEstadosReservasResolver: ResolveFn<ObtenerEstadosReserva[]> = (route) => {
  return inject(ReservasResource).getEstadosReserva();
};

export const obtenerReservaClienteResolver: ResolveFn<ReservaCliente> = (route) => {
  return inject(ReservaResource).getReservaCliente({ nroReserva: route.params['nro_reserva'] });
};
