import { Injectable } from '@angular/core';
import {
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod,
} from '@ngx-resource/core';
import { environment } from '../../../../enviroments/enviroment.development';
import { Restaurante } from './models/restaurante.model';
import type { IResourceMethodObservable } from '@ngx-resource/core';
import { SucursalRestaurante } from './models/sucursal-restaurante';
import { PreferenciaRestaurante } from './models/preferencia-restaurante.model';
import { Sucursal } from './models/sucursal.model';
import { Restaurant } from './models/restaurant.model';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/ristorino`,
})
export class RestauranteResource extends Resource {
  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    path: '/restaurante/{nroRestaurante}',
    method: ResourceRequestMethod.Get,
  })
  declare getDatosRestaurante: IResourceMethodObservable<{ nroRestaurante: number }, Restaurant>;

  @ResourceAction({
    path: '/restaurante/{nroRestaurante}/sucursales',
    method: ResourceRequestMethod.Get,
  })
  declare getSucursalesRestaurante: IResourceMethodObservable<
    { nroRestaurante: number },
    Sucursal[]
  >;

  @ResourceAction({
    path: '/preferencias/{nroRestaurante}',
    method: ResourceRequestMethod.Get,
  })
  declare getPreferenciasRestaurante: IResourceMethodObservable<
    { nroRestaurante: number },
    PreferenciaRestaurante[]
  >;

  //TRAEMOS TODOS LOS RESTAURANTES
  @ResourceAction({
    path: '/restaurantes',
    method: ResourceRequestMethod.Get,
  })
  declare getRestaurantes: IResourceMethodObservable<void, Restaurante[]>;

  //TRAEMOS TODAS LAS SUCURSALES DE UN RESTAURANTE
  @ResourceAction({
    path: '/sucursales/{nro_restaurante}',
    method: ResourceRequestMethod.Get,
  })
  declare getSucursalesDeRestaurante: IResourceMethodObservable<
    { nro_restaurante: number },
    SucursalRestaurante[]
  >;
}
