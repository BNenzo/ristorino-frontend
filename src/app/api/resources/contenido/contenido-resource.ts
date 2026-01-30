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
import { RegistrarClickPromocionBody } from './models/registrarClickPromocionBody.model';
import { Promotion } from './models/promotion.model';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/ristorino`,
})
export class ContenidoResource extends Resource {
  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    path: '/promociones',
    method: ResourceRequestMethod.Get,
  })
  declare getPromociones: IResourceMethodObservable<void, Promotion[]>;

  @ResourceAction({
    path: '/registrar-click-promocion',
    method: ResourceRequestMethod.Post,
  })
  declare registrarClickContenido: IResourceMethodObservable<RegistrarClickPromocionBody, any>;
}
