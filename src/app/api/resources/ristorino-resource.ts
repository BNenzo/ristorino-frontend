import { Injectable } from '@angular/core';
import {
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod,
} from '@ngx-resource/core';
import { environment } from '../../../enviroments/enviroment.development';
import type { IResourceMethodObservable } from '@ngx-resource/core';
import { Promotion } from './models/promotion.model';
import { Restaurant } from './models/restaurant.model';
import { Sucursal } from './models/sucursal.model';
import { PreferenciaRestaurante } from './models/preferencia-restaurante.model';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/ristorino`,
})
export class RistorinoResource extends Resource {
  constructor(handler: ResourceHandler) {
    super(handler);
  }
  @ResourceAction({
    path: '/promociones',
    method: ResourceRequestMethod.Get,
  })
  declare getPromociones: IResourceMethodObservable<void, Promotion[]>;

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
}
