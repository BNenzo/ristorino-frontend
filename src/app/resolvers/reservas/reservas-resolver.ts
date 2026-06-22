import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ObtenerReservasCliente } from '../../api/resources/reservas/models/obtener-reservas-cliente.model';
import { ReservasResource } from '../../api/resources/reservas/reservas-resource';
import { ObtenerEstadosReserva } from '../../api/resources/reservas/models/obtener-estados-reserva.model';
import { ObtenerSucursalesFormReservas } from '../../api/resources/reservas/models/obtener-sucursales.model';
import { ObtenerZonasSucursalesRestaurantesFormReservas } from '../../api/resources/reservas/models/obtener-zonas-sucursales-restaurantes.model';

export const obtenerReservasClienteResolver: ResolveFn<ObtenerReservasCliente[]> = (route) => {
  return inject(ReservasResource).getReservasCliente();
};

export const obtenerEstadosReservasResolver: ResolveFn<ObtenerEstadosReserva[]> = (route) => {
  return inject(ReservasResource).getEstadosReserva();
};

export const obtenerSucursalesFormReservasResolver: ResolveFn<ObtenerSucursalesFormReservas[]> = (
  route,
) => {
  return inject(ReservasResource).getObtenerSucursalesFormReservas();
};

export const obtenerZonasSucursalesRestaurantesFormReservasResolver: ResolveFn<
  ObtenerZonasSucursalesRestaurantesFormReservas[]
> = (route) => {
  return inject(ReservasResource).getObtenerZonasSucursalesRestaurantesFormReservas();
};
