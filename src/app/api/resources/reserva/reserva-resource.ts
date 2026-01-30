import { Injectable } from '@angular/core';
import {
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod,
} from '@ngx-resource/core';
import { environment } from '../../../../enviroments/enviroment.development';
import type { IResourceMethodObservable } from '@ngx-resource/core';
import { TurnoDisponible } from './models/turno-disponible.model';
import { CrearReservaRequest } from './models/reserva.model';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/ristorino`,
})
export class ReservaResource extends Resource {
  constructor(handler: ResourceHandler) {
    super(handler);
  }

  //TRAEMOS LOS TURNOS DISPONIBLES DE UNA SUCURSAL
  @ResourceAction({
    path: '/reservas/disponibilidad',
    method: ResourceRequestMethod.Get,
  })
  declare getDisponibilidadTurnos: IResourceMethodObservable<
    {
      nroRestaurante: number;
      nroSucursal: number;
      fechaAReservar: string;
    },
    TurnoDisponible[]
  >;

  // REVISAR!!!
  //HACEMOS POST DE UNA RESERVA
  @ResourceAction({
    path: '/reservas',
    method: ResourceRequestMethod.Post,
  })
  declare crearReserva: IResourceMethodObservable<CrearReservaRequest, void>;
}
