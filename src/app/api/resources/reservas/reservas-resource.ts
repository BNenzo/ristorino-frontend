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
}
