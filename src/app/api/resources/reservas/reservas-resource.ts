import { Injectable } from '@angular/core';
import {
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod,
} from '@ngx-resource/core';
import type { IResourceMethodObservable } from '@ngx-resource/core';
import { environment } from '../../../../enviroments/enviroment.development';
import { ObtenerReservasCliente } from './models/obtener-reservas-cliente.model';
import { ObtenerEstadosReserva } from './models/obtener-estados-reserva.model';
import { ObtenerSucursalesFormReservas } from './models/obtener-sucursales.model';
import { ObtenerZonasSucursalesRestaurantesFormReservas } from './models/obtener-zonas-sucursales-restaurantes.model';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/ristorino`,
})
export class ReservasResource extends Resource {
  constructor(handler: ResourceHandler) {
    super(handler);
  }
  @ResourceAction({
    path: '/reservas/cliente',
    method: ResourceRequestMethod.Get,
  })
  declare getReservasCliente: IResourceMethodObservable<
    {
      fecha?: string;
      estados?: string[];
    },
    ObtenerReservasCliente[]
  >;

  @ResourceAction({
    path: '/reservas/estados',
    method: ResourceRequestMethod.Get,
  })
  declare getEstadosReserva: IResourceMethodObservable<void, ObtenerEstadosReserva[]>;

  @ResourceAction({
    path: '/reservas/obtener-sucursales',
    method: ResourceRequestMethod.Get,
  })
  declare getObtenerSucursalesFormReservas: IResourceMethodObservable<
    void,
    ObtenerSucursalesFormReservas[]
  >;

  @ResourceAction({
    path: '/reservas/obtener-zonas-sucursales-restaurantes',
    method: ResourceRequestMethod.Get,
  })
  declare getObtenerZonasSucursalesRestaurantesFormReservas: IResourceMethodObservable<
    void,
    ObtenerZonasSucursalesRestaurantesFormReservas[]
  >;
}
