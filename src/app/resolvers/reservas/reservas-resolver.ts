import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ObtenerReservasCliente } from '../../api/resources/reservas/models/obtener-reservas-cliente.model';
import { ReservasResource } from '../../api/resources/reservas/reservas-resource';
import { ObtenerEstadosReserva } from '../../api/resources/reservas/models/obtener-estados-reserva.model';

export const obtenerReservasClienteResolver: ResolveFn<ObtenerReservasCliente[]> = (route) => {
  return inject(ReservasResource).getReservasCliente();
};

export const obtenerEstadosReservasResolver: ResolveFn<ObtenerEstadosReserva[]> = (route) => {
  return inject(ReservasResource).getEstadosReserva();
};
