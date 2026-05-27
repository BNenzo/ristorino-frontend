import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ObtenerReservasCliente } from '../../api/resources/reservas/models/obtener-reservas-cliente.model';
import { ReservasResource } from '../../api/resources/reservas/reservas-resource';
import { ObtenerEstadosReserva } from '../../api/resources/reservas/models/obtener-estados-reserva.model';
import { ReservaResource } from '../../api/resources/reserva/reserva-resource';
import { ReservaCliente } from '../../api/resources/reserva/models/reserva-cliente.model';
import { catchError, EMPTY, mergeMap, of } from 'rxjs';
import { puedeEditarReserva } from '../../pages/editar-reserva/utils';
import { TEstadoReserva } from '../../types';
import { ObtenerSucursalesFormReservas } from '../../api/resources/reservas/models/obtener-sucursales.model';
import { ObtenerZonasSucursalesRestaurantesFormReservas } from '../../api/resources/reservas/models/obtener-zonas-sucursales-restaurantes.model';

export const obtenerReservasClienteResolver: ResolveFn<ObtenerReservasCliente[]> = (route) => {
  return inject(ReservasResource).getReservasCliente();
};

export const obtenerEstadosReservasResolver: ResolveFn<ObtenerEstadosReserva[]> = (route) => {
  return inject(ReservasResource).getEstadosReserva();
};

export const obtenerReservaClienteResolver: ResolveFn<ReservaCliente> = (route) => {
  const api = inject(ReservaResource);
  const router = inject(Router);

  const nroReserva = route.params['nro_reserva'];

  return api.getReservaCliente({ nroReserva }).pipe(
    mergeMap((reserva: ReservaCliente) => {
      if (
        !puedeEditarReserva({
          codEstado: reserva.codEstado as TEstadoReserva,
          fechaCancelacion: null,
          fechaReserva: reserva.fechaReserva,
          horaReserva: reserva.horaReserva,
        })
      ) {
        router.navigate(['/mis-reservas']);
        return EMPTY; // corta navegación
      }

      return of(reserva);
    }),
    catchError(() => {
      router.navigate(['/mis-reservas']);
      return EMPTY;
    }),
  );
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
