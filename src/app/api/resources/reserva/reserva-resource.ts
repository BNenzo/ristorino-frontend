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
import { ReservaCliente } from './models/reserva-cliente.model';

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
  declare crearReserva: IResourceMethodObservable<CrearReservaRequest, string>;

  // OBTENER LA RESERVA DE UN CLIENTE
  @ResourceAction({
    path: '/reservas/cliente/{nroReserva}',
    method: ResourceRequestMethod.Get,
  })
  declare getReservaCliente: IResourceMethodObservable<{ nroReserva: number }, ReservaCliente>;

  // ACTUALIZAR LA RESERVA DE UN CLIENTE
  @ResourceAction({
    path: '/reservas/cliente/{nroReserva}',
    method: ResourceRequestMethod.Put,
  })
  declare actualizarReservaCliente: IResourceMethodObservable<
    {
      nroRestaurante: number;
      nroReserva: number;
      fechaReserva?: string;
      cantAdultos?: number;
      horaReserva?: string;
      fechaCancelacion?: string;
      codReservaSucursal?: string;
    },
    ReservaCliente
  >;
}
